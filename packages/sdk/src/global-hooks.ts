import { SDKInterface } from "./core/memory-monitor";

export class GlobalHooks {
  private _attached = false;
  private _consolePatched = false;

  constructor(
    private sdk: SDKInterface & {
      transport: { flush(): Promise<void> };
      _shouldIgnore(err: Error): boolean;
      captureError(error: Error, options?: any): Promise<any>;
    },
  ) {}

  attach(): void {
    if (this._attached) return;
    this._attached = true;

    this._hookUncaughtException();
    this._hookUnhandledRejection();
    this._hookProcessSignals();
    this._hookNodeWarnings();

    // @ts-ignore
    if (this.sdk.config.integrations.console) {
      this._hookConsoleError();
    }

    this.sdk.logger.debug("[IW] Global hooks attached");
  }

  attachConsoleError(): void {
    if (this._consolePatched) return;
    this._consolePatched = true;
    this._hookConsoleError();
    this.sdk.logger.debug("[IW] console.error hook attached dynamically");
  }

  private _hookUncaughtException(): void {
    process.on("uncaughtException", async (error, origin) => {
      this.sdk.logger.error("[IW] uncaughtException — process will exit", {
        error: error.message,
        stack: error.stack,
        origin,
      });

      try {
        await this.sdk.captureError(error, {
          severity: "SEV1",
          tags: ["uncaught-exception", "crash", "process-exit"],
          context: { origin, processId: process.pid },
        });
      } catch (sendErr: any) {
        this.sdk.logger.error("[IW] Failed to send crash incident", {
          err: sendErr.message,
        });
      }

      process.exit(1);
    });
  }

  private _hookUnhandledRejection(): void {
    process.on("unhandledRejection", async (reason) => {
      const error =
        reason instanceof Error
          ? reason
          : new Error(`Unhandled rejection: ${String(reason)}`);

      this.sdk.logger.error("[IW] unhandledRejection", {
        error: error.message,
        stack: error.stack,
      });

      try {
        await this.sdk.captureError(error, {
          severity: "SEV2",
          tags: ["unhandled-rejection", "async-error"],
          context: { processId: process.pid },
        });
      } catch (_) {}
    });
  }

  private _hookProcessSignals(): void {
    const gracefulShutdown = async (signal: string) => {
      this.sdk.logger.info(
        `[IW] ${signal} received — flushing incidents before shutdown`,
      );

      try {
        await this.sdk.transport.flush();
        this.sdk.logger.info("[IW] Flush complete. Shutting down.");
      } catch (err: any) {
        this.sdk.logger.error("[IW] Flush failed on shutdown", {
          err: err.message,
        });
      }

      process.exit(0);
    };

    process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.once("SIGINT", () => gracefulShutdown("SIGINT"));
  }

  private _hookNodeWarnings(): void {
    process.on("warning", (warning) => {
      this.sdk.logger.warn("[IW] Node.js warning", {
        name: warning.name,
        message: warning.message,
        code: (warning as any).code,
      });

      if (warning.name === "MaxListenersExceededWarning") {
        this.sdk
          .captureIncident({
            title: `Node.js: ${warning.message}`,
            severity: "SEV3",
            tags: ["node-warning", "memory-leak-risk"],
          })
          .catch(() => {});
      }
    });
  }

  private _hookConsoleError(): void {
    const originalConsoleError = console.error.bind(console);

    console.error = (...args: any[]) => {
      originalConsoleError(...args);

      const message = args
        .map((a) => (a instanceof Error ? a.message : String(a)))
        .join(" ");

      const error = args[0] instanceof Error ? args[0] : new Error(message);

      if (!this.sdk._shouldIgnore(error)) {
        this.sdk
          .captureError(error, {
            severity: "SEV3",
            tags: ["console-error"],
          })
          .catch(() => {});
      }
    };

    this.sdk.logger.debug("[IW] console.error patched");
  }
}
