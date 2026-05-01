import { SDKConfig } from "../types";
import { Logger } from "winston";

const CHECK_INTERVAL_MS = 30_000;

export interface SDKInterface {
  config: SDKConfig;
  logger: Logger;
  captureIncident(data: any): Promise<any>;
}

export class MemoryMonitor {
  private _timer: NodeJS.Timeout | null = null;
  private _alerted = false; // ek hi incident per session

  constructor(private sdk: SDKInterface) {}

  start() {
    this._timer = setInterval(() => this._check(), CHECK_INTERVAL_MS);
    if (this._timer.unref) {
      this._timer.unref(); // process exit hone se nahi rokta
    }
    this.sdk.logger.debug("[IW] Memory monitor started");
  }

  stop() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  private _check() {
    const mem = process.memoryUsage();
    const heapUsedMb = Math.round(mem.heapUsed / 1024 / 1024);
    const heapTotalMb = Math.round(mem.heapTotal / 1024 / 1024);
    const heapPct = Math.round((mem.heapUsed / mem.heapTotal) * 100);
    const rssMb = Math.round(mem.rss / 1024 / 1024);

    this.sdk.logger.debug("[IW] Memory check", {
      heapUsedMb,
      heapTotalMb,
      heapPct,
      rssMb,
    });

    const heapAlert = heapPct >= this.sdk.config.heapAlertThresholdPct;
    const rssAlert = rssMb >= this.sdk.config.memoryAlertThresholdMb;

    if ((heapAlert || rssAlert) && !this._alerted) {
      this._alerted = true;
      const title = heapAlert
        ? `High heap usage: ${heapPct}% (${heapUsedMb}MB / ${heapTotalMb}MB)`
        : `High RSS memory: ${rssMb}MB`;

      this.sdk.logger.warn(`[IW] ${title}`);

      this.sdk
        .captureIncident({
          title,
          severity: "SEV2",
          tags: ["memory", "heap-pressure"],
          context: { heapUsedMb, heapTotalMb, heapPct, rssMb },
        })
        .catch(() => {});

      // 5 minute baad reset — agar memory down aa jaaye to phir se alert kare
      setTimeout(
        () => {
          this._alerted = false;
        },
        5 * 60 * 1000,
      );
    }
  }
}
