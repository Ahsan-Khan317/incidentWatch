import { SDKConfig, UserConfig } from "../types";

export class Config implements SDKConfig {
  public apiKey: string;
  public serverId: string;
  public platformUrl: string;
  public environment: string;
  public release: string;
  public appName: string;
  public slowThresholdMs: number;
  public breadcrumbLimit: number;
  public heartbeatIntervalMs: number;
  public flushIntervalMs: number;
  public debug: boolean;
  public ignoreErrors: Array<string | RegExp>;
  public memoryAlertThresholdMb: number;
  public heapAlertThresholdPct: number;
  public integrations: SDKConfig["integrations"];
  public logger: SDKConfig["logger"];
  public transport: SDKConfig["transport"];

  constructor(userConfig: UserConfig) {
    this._validate(userConfig);

    this.apiKey = userConfig.apiKey.trim();
    this.serverId = userConfig.serverId.trim();

    this.platformUrl = (
      userConfig.platformUrl ||
      process.env.IW_PLATFORM_URL ||
      "https://app.incidentwatch.io"
    ).replace(/\/$/, "");

    this.environment =
      userConfig.environment || process.env.NODE_ENV || "production";
    this.release =
      userConfig.release || process.env.npm_package_version || "unknown";
    this.appName = userConfig.appName || process.env.npm_package_name || "app";

    this.slowThresholdMs = userConfig.slowThresholdMs ?? 5000;
    this.breadcrumbLimit = userConfig.breadcrumbLimit ?? 50;
    this.heartbeatIntervalMs = userConfig.heartbeatIntervalMs ?? 5000;
    this.flushIntervalMs = userConfig.flushIntervalMs ?? 2000;

    this.memoryAlertThresholdMb = userConfig.memoryAlertThresholdMb ?? 512;
    this.heapAlertThresholdPct = userConfig.heapAlertThresholdPct ?? 90;

    this.debug = userConfig.debug ?? process.env.IW_DEBUG === "true";

    this.ignoreErrors = userConfig.ignoreErrors || [
      /ECONNRESET/,
      /socket hang up/,
      /read ECONNRESET/,
      /write ECONNRESET/,
      /EPIPE/,
    ];

    const integrations = (userConfig.integrations || {}) as any;
    this.integrations = {
      express: integrations.express ?? true,
      axios: integrations.axios ?? true,
      fetch: integrations.fetch ?? true,
      console: integrations.console ?? false,
    };

    this.logger = {
      level: userConfig.logger?.level ?? (this.debug ? "debug" : "info"),
      prettyPrint:
        userConfig.logger?.prettyPrint ?? this.environment !== "production",
      filePath: userConfig.logger?.filePath ?? null,
    };

    this.transport = {
      timeout: userConfig.transport?.timeout ?? 8000,
      retries: userConfig.transport?.retries ?? 3,
      retryDelay: userConfig.transport?.retryDelay ?? 1000,
    };
  }

  private _validate(config: UserConfig): void {
    const missing: string[] = [];
    if (!config.apiKey) missing.push("apiKey");
    if (!config.serverId) missing.push("serverId");

    if (missing.length > 0) {
      throw new Error(
        `[IncidentWatch] Missing required config: ${missing.join(", ")}\n\n` +
          `  Quick fix:\n` +
          `    const { init } = require('@incidentwatch/sdk');\n` +
          `    init({\n` +
          `      apiKey: '${missing.includes("apiKey") ? "your-api-key" : "iw_xxx"}',\n` +
          `      serverId: '${missing.includes("serverId") ? "prod-server-1" : "my-server"}',\n` +
          `    });\n\n` +
          `  Get your API key at https://app.incidentwatch.io/settings/keys\n`,
      );
    }

    if (config.apiKey.length < 8) {
      throw new Error(
        "[IncidentWatch] apiKey appears invalid (too short — must be at least 8 characters)\n\n" +
          "  Get your API key at https://app.incidentwatch.io/settings/keys\n",
      );
    }

    if (config.serverId && !/^[a-zA-Z0-9_-]+$/.test(config.serverId)) {
      throw new Error(
        "[IncidentWatch] serverId contains invalid characters. Use only letters, numbers, hyphens, and underscores.\n\n" +
          '  Example: "prod-api-1", "staging-worker-2"\n',
      );
    }

    if (config.slowThresholdMs && config.slowThresholdMs < 100) {
      throw new Error(
        `[IncidentWatch] slowThresholdMs (${config.slowThresholdMs}) is too low. Minimum is 100ms.\n` +
          "  This may cause excessive incident generation.\n",
      );
    }
  }
}
