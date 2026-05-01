import morgan from "morgan";
import { SDKInterface } from "../core/memory-monitor";

export class ExpressIntegration {
  constructor(private sdk: SDKInterface) {}

  /**
   * Express.prototype ko patch karo — taaki har naye app instance pe
   * automatically SDK middleware lag jaaye.
   */
  autoRegister(): void {
    let express: any;
    try {
      // @ts-ignore
      express = require("express");
    } catch {
      this.sdk.logger.debug(
        "[IW] Express not found — skipping auto-registration",
      );
      return;
    }

    const self = this;

    // Express.prototype.listen patch karo — jab server start ho tab middleware inject
    const originalListen = express.application.listen;

    express.application.listen = function (this: any, ...args: any[]) {
      // Morgan (HTTP logger) inject karo — routes ke pehle
      this.use(self._morganMiddleware());
      self.sdk.logger.debug("[IW] Morgan HTTP logger attached to Express");

      // SDK error middleware inject karo — routes ke baad
      this.use(self.errorMiddleware());
      self.sdk.logger.debug(
        "[IW] IW error middleware auto-attached to Express",
      );

      // Async route handler wrapper — use middleware approach for dynamic route coverage
      self._installAsyncWrapper(this);

      // Also wrap existing routes added before listen()
      self._wrapExistingAsyncRoutes(this);

      return originalListen.apply(this, args);
    };

    this.sdk.logger.debug(
      "[IW] Express auto-registration set up — will activate on app.listen()",
    );
  }

  /**
   * Express error middleware function return karta hai.
   */
  errorMiddleware(): (
    err: any,
    req: any,
    res: any,
    next: any,
  ) => Promise<void> {
    const sdk = this.sdk;

    return async function iwErrorMiddleware(
      err: any,
      req: any,
      res: any,
      next: any,
    ) {
      const status = err.status || err.statusCode || 500;

      // 4xx → client error, SDK capture nahi karta (by default)
      if (status < 500) {
        return next(err);
      }

      // Request details breadcrumb mein add karo
      // @ts-ignore
      sdk.addBreadcrumb(
        "http.error",
        {
          method: req.method,
          url: req.originalUrl || req.url,
          status,
          userAgent: req.headers?.["user-agent"],
          ip: req.ip,
          body: sdk.config.debug ? req.body : undefined,
        },
        "error",
      );

      try {
        // @ts-ignore
        await sdk.captureError(err, {
          severity: status >= 500 ? "SEV2" : "SEV3",
          tags: ["express", "http-error", `status-${status}`],
          context: {
            method: req.method,
            url: req.originalUrl || req.url,
            status,
            headers: {
              host: req.headers?.host,
              "content-type": req.headers?.["content-type"],
            },
          },
        });
      } catch (sdkErr: any) {
        sdk.logger.error("[IW] Failed to send Express error incident", {
          err: sdkErr.message,
        });
      }

      next(err);
    };
  }

  private _morganMiddleware(): any {
    const sdk = this.sdk;
    const format = sdk.config.environment === "production" ? "combined" : "dev";

    const morganStream = {
      write: (message: string) => {
        // @ts-ignore
        sdk.logger.http(message.trim());
      },
    };

    morgan.token("iw-slow", (req: any, res: any) => {
      const rt = parseFloat(res.getHeader("X-Response-Time") || "0");
      return rt > sdk.config.slowThresholdMs ? `[SLOW:${rt}ms]` : "";
    });

    const mw = morgan(format, { stream: morganStream });

    return (req: any, res: any, next: any) => {
      const start = Date.now();

      res.on("finish", () => {
        const duration = Date.now() - start;
        const status = res.statusCode;

        // @ts-ignore
        sdk.addBreadcrumb(
          "http.request",
          {
            method: req.method,
            url: req.originalUrl || req.url,
            status,
            duration,
          },
          status >= 400 ? "warn" : "info",
        );

        if (duration > sdk.config.slowThresholdMs && status < 500) {
          sdk.logger.warn(
            `[IW] Slow request: ${req.method} ${req.url} ${duration}ms`,
          );
        }
      });

      mw(req, res, next);
    };
  }

  /**
   * Install a middleware that wraps all incoming async route handlers at request time.
   * This catches routes added after app.listen() too.
   */
  private _installAsyncWrapper(app: any): void {
    // Use a middleware that wraps the route handling
    const self = this;

    // Monkey-patch app.use / app.get / app.post etc to auto-wrap handlers
    const methods = [
      "use",
      "get",
      "post",
      "put",
      "delete",
      "patch",
      "head",
      "options",
      "all",
    ];
    for (const method of methods) {
      const original = app[method];
      if (!original || typeof original !== "function") continue;

      app[method] = function (...handlerArgs: any[]) {
        const wrappedArgs = handlerArgs.map((arg: any) => {
          if (typeof arg === "function") {
            return self._wrapHandler(arg);
          }
          return arg;
        });
        return original.apply(this, wrappedArgs);
      };
    }
  }

  /**
   * Wrap all existing route handlers that were added before listen().
   */
  private _wrapExistingAsyncRoutes(app: any): void {
    if (app._router?.stack) {
      app._router.stack.forEach((layer: any) => {
        this._wrapLayer(layer);
      });
    }
  }

  private _wrapLayer(layer: any): void {
    if (layer.handle && typeof layer.handle === "function") {
      layer.handle = this._wrapHandler(layer.handle);
    }
    if (layer.route?.stack) {
      layer.route.stack.forEach((routeLayer: any) => {
        if (routeLayer.handle && typeof routeLayer.handle === "function") {
          routeLayer.handle = this._wrapHandler(routeLayer.handle);
        }
      });
    }
  }

  private _wrapHandler(handler: any): any {
    if (handler.length === 4) return handler; // error middleware — skip
    if (!this._isAsync(handler)) return handler; // sync handler — no wrap needed

    const self = this;
    return function wrappedAsync(req: any, res: any, next: any) {
      Promise.resolve(handler(req, res, next)).catch((err: any) => {
        self.sdk.logger.debug(`[IW] Async route error caught: ${err.message}`);
        next(err);
      });
    };
  }

  private _isAsync(fn: any): boolean {
    return fn?.constructor?.name === "AsyncFunction";
  }
}
