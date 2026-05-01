import { v4 as uuidv4 } from "uuid";
import { Logger } from "winston";
import { Config } from "./utils/config";
import { createLogger } from "./utils/logger";
import { GlobalHooks } from "./global-hooks";
import {
  AxiosIntegration,
  ExpressIntegration,
  FetchIntegration,
} from "./integrations";
import {
  BreadcrumbManager,
  IncidentBuilder,
  MemoryMonitor,
  HeartbeatManager,
  HttpTransport,
} from "./core";
import {
  UserConfig,
  IncidentData,
  CaptureErrorOptions,
  Severity,
  Scope,
  SDKStatus,
  UserInfo,
} from "./types";
import { AsyncLocalStorage } from "async_hooks";

export class IncidentWatchSDK {
  public config: Config;
  public logger: Logger;
  public transport: HttpTransport;
  public breadcrumbs: BreadcrumbManager;
  public builder: IncidentBuilder;
  public integrations: {
    express: ExpressIntegration;
    axios: AxiosIntegration;
    fetch: FetchIntegration;
  };
  public hooks: GlobalHooks;
  public memoryMonitor: MemoryMonitor;
  public heartbeat: HeartbeatManager;

  private _scope: Scope = { tags: [], context: {} };
  private _als = new AsyncLocalStorage<Map<string, unknown>>();

  constructor(userConfig: UserConfig) {
    this.config = new Config(userConfig);
    this.logger = createLogger(this.config);
    this.transport = new HttpTransport(this.config, this.logger);
    this.breadcrumbs = new BreadcrumbManager(this.config.breadcrumbLimit);
    this.builder = new IncidentBuilder(this.config, this.breadcrumbs);

    this.integrations = {
      express: new ExpressIntegration(this),
      axios: new AxiosIntegration(this),
      fetch: new FetchIntegration(this),
    };

    this.hooks = new GlobalHooks(this);
    this.memoryMonitor = new MemoryMonitor(this);
    this.heartbeat = new HeartbeatManager(this);
  }

  _bootstrap(): void {
    this.logger.info("IncidentWatch SDK initializing...", {
      serverId: this.config.serverId,
      node: process.version,
      environment: this.config.environment,
    });

    this.hooks.attach();
    this.memoryMonitor.start();
    this.heartbeat.start();

    if (this.config.integrations.axios) this.integrations.axios.patch();
    if (this.config.integrations.fetch) this.integrations.fetch.patch();
    if (this.config.integrations.express)
      this.integrations.express.autoRegister();

    this.logger.info("IncidentWatch SDK ready ✓");
  }

  // ── Core Capture Methods ───────────────────────────────────────────────

  async captureIncident(
    data: IncidentData,
  ): Promise<{ incidentId: string } | null> {
    const mergedData = this._mergeScope(data);
    const incident = this.builder.fromManual(mergedData);
    this._injectRequestId(incident);
    return this.transport.send(incident);
  }

  async captureError(
    error: Error,
    options: CaptureErrorOptions = {},
  ): Promise<{ incidentId: string } | null> {
    if (this._shouldIgnore(error)) return null;
    const mergedOptions = this._mergeScope(options);
    const incident = this.builder.fromError(error, mergedOptions);
    this._injectRequestId(incident);
    this.logger.error(`Incident captured: ${error.message}`, {
      incidentId: incident.id,
      severity: incident.severity,
    });
    return this.transport.send(incident);
  }

  async captureMessage(
    message: string,
    options: {
      severity?: Severity;
      tags?: string[];
      context?: Record<string, unknown>;
    } = {},
  ): Promise<{ incidentId: string } | null> {
    return this.captureIncident({
      title: message,
      severity: options.severity || "SEV3",
      tags: options.tags,
      context: options.context,
    });
  }

  // ── Scope / Context Helpers ────────────────────────────────────────────

  setTag(key: string, value: string): void {
    if (!this._scope.tags.includes(`${key}:${value}`)) {
      this._scope.tags.push(`${key}:${value}`);
    }
    this.logger.debug(`[IW] Tag set: ${key}=${value}`);
  }

  setContext(key: string, value: unknown): void {
    this._scope.context[key] = value;
    this.logger.debug(`[IW] Context set: ${key}`);
  }

  setUser(user: UserInfo): void {
    this._scope.user = user;
    this.logger.debug(`[IW] User set: ${user.id || user.email || "anonymous"}`);
  }

  clearScope(): void {
    this._scope = { tags: [], context: {} };
    this.logger.debug("[IW] Scope cleared");
  }

  // ── Scoped Operations (withScope) ──────────────────────────────────────

  async withScope<T>(
    scopeOverrides: Partial<Scope>,
    fn: () => Promise<T>,
  ): Promise<T> {
    const previousTags = [...this._scope.tags];
    const previousContext = { ...this._scope.context };
    const previousUser = this._scope.user;

    if (scopeOverrides.tags) {
      this._scope.tags = [...scopeOverrides.tags];
    }
    if (scopeOverrides.context) {
      this._scope.context = {
        ...this._scope.context,
        ...scopeOverrides.context,
      };
    }
    if (scopeOverrides.user) {
      this._scope.user = scopeOverrides.user;
    }

    try {
      return await fn();
    } finally {
      this._scope.tags = previousTags;
      this._scope.context = previousContext;
      this._scope.user = previousUser;
    }
  }

  // ── Async Wrapper (for non-Express async functions) ────────────────────

  wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    operationName?: string,
  ): T {
    const name = operationName || fn.name || "anonymous";
    return ((...args: any[]) => {
      return this._als.run(new Map(), async () => {
        this._als.getStore()?.set("operation", name);
        this.addBreadcrumb(
          `async.start.${name}`,
          { argsCount: args.length },
          "debug",
        );
        try {
          const result = await fn(...args);
          this.addBreadcrumb(
            `async.end.${name}`,
            { status: "success" },
            "debug",
          );
          return result;
        } catch (error: any) {
          this.addBreadcrumb(
            `async.error.${name}`,
            { error: error.message },
            "error",
          );
          if (this._shouldIgnore(error)) throw error;
          await this.captureError(error, {
            severity: "SEV2",
            tags: ["async-wrapped", name],
            context: { operation: name },
          }).catch(() => {});
          throw error;
        }
      });
    }) as T;
  }

  // ── Request ID Tracking ────────────────────────────────────────────────

  runWithRequestId<T>(requestId: string, fn: () => T): T {
    const store = new Map<string, unknown>();
    store.set("requestId", requestId);
    return this._als.run(store, fn);
  }

  getCurrentRequestId(): string | undefined {
    return this._als.getStore()?.get("requestId") as string | undefined;
  }

  // ── Integration Toggles ────────────────────────────────────────────────

  enableIntegration(name: "express" | "axios" | "fetch" | "console"): void {
    this.config.integrations[name] = true;
    if (name === "axios" && this.integrations.axios) {
      this.integrations.axios.patch();
    }
    if (name === "fetch" && this.integrations.fetch) {
      this.integrations.fetch.patch();
    }
    if (name === "console" && this.hooks) {
      this.hooks.attachConsoleError();
    }
    this.logger.info(`[IW] Integration enabled: ${name}`);
  }

  disableIntegration(name: "express" | "axios" | "fetch" | "console"): void {
    this.config.integrations[name] = false;
    this.logger.info(`[IW] Integration disabled: ${name}`);
  }

  enableAllIntegrations(): void {
    (["express", "axios", "fetch", "console"] as const).forEach((name) =>
      this.enableIntegration(name),
    );
  }

  disableAllIntegrations(): void {
    (["express", "axios", "fetch", "console"] as const).forEach((name) =>
      this.disableIntegration(name),
    );
  }

  // ── Graceful Shutdown ──────────────────────────────────────────────────

  async shutdown(): Promise<void> {
    this.logger.info("[IW] Shutting down IncidentWatch SDK...");

    this.memoryMonitor.stop();
    this.heartbeat.stop();

    try {
      await this.transport.flush();
      this.logger.info("[IW] All pending incidents flushed");
    } catch (err: any) {
      this.logger.error("[IW] Failed to flush incidents on shutdown", {
        err: err.message,
      });
    }

    this.logger.info("[IW] IncidentWatch SDK shut down complete");
  }

  // ── SDK Status / Health ────────────────────────────────────────────────

  getStatus(): SDKStatus {
    return {
      initialized: true,
      version: "1.0.0",
      integrations: { ...this.config.integrations },
      memoryMonitor: true,
      heartbeat: true,
      circuitBreakerOpen: this.transport.isCircuitOpen(),
      config: {
        environment: this.config.environment,
        serverId: this.config.serverId,
        appName: this.config.appName,
        slowThresholdMs: this.config.slowThresholdMs,
        debug: this.config.debug,
      },
    };
  }

  // ── Breadcrumb & Timer ─────────────────────────────────────────────────

  addBreadcrumb(
    category: string,
    data: Record<string, unknown> = {},
    level: "info" | "warn" | "error" | "debug" = "info",
  ): void {
    this.breadcrumbs.add({ category, data, level });
  }

  startTimer(
    operation: string,
    context: Record<string, unknown> = {},
    thresholdMs?: number,
  ): () => number {
    const threshold = thresholdMs ?? this.config.slowThresholdMs;
    const start = Date.now();
    const crumbId = uuidv4().substring(0, 8);
    this.addBreadcrumb(`timer.start.${operation}`, { ...context, crumbId });

    return () => {
      const duration = Date.now() - start;
      this.addBreadcrumb(`timer.end.${operation}`, {
        duration,
        ...context,
        crumbId,
      });

      if (duration > threshold) {
        this.logger.warn(
          `[IW] Slow operation: ${operation} took ${duration}ms`,
        );
        this.captureIncident({
          title: `Slow: ${operation} (${duration}ms > ${threshold}ms)`,
          severity: "SEV3",
          tags: ["performance", "slow-operation"],
          context: { operation, duration, threshold, ...context },
        }).catch(() => {});
      }
      return duration;
    };
  }

  // ── Logger Accessor ────────────────────────────────────────────────────

  get log(): Logger {
    return this.logger;
  }

  // ── Private Helpers ────────────────────────────────────────────────────

  _shouldIgnore(error: Error): boolean {
    return this.config.ignoreErrors.some((pattern) => {
      if (pattern instanceof RegExp) return pattern.test(error.message);
      return error.message.includes(pattern);
    });
  }

  private _mergeScope<
    T extends { tags?: string[]; context?: Record<string, unknown> },
  >(data: T): T {
    const merged = { ...data };
    const globalTags = this._scope.tags || [];
    merged.tags = [
      ...(data.tags || []),
      ...globalTags.filter((t) => !(data.tags || []).includes(t)),
    ];
    merged.context = { ...this._scope.context, ...(data.context || {}) };
    if (this._scope.user) {
      merged.context = { ...merged.context, user: this._scope.user };
    }
    return merged;
  }

  private _injectRequestId(incident: {
    context: Record<string, unknown>;
  }): void {
    const requestId = this.getCurrentRequestId();
    if (requestId) {
      incident.context.requestId = requestId;
    }
  }
}
