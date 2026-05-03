import { IncidentWatchSDK } from "../sdk";
import { v4 as uuidv4 } from "uuid";
import { LogEvent } from "../types";

export class HeartbeatManager {
  private sdk: IncidentWatchSDK;
  private intervalId?: NodeJS.Timeout;
  private flushIntervalId?: NodeJS.Timeout;
  private logBuffer: LogEvent[] = [];
  private maxBufferSize = 1000;

  constructor(sdk: IncidentWatchSDK) {
    this.sdk = sdk;
  }

  public start(): void {
    if (this.intervalId) return;

    // Terminal logs capture karne ke liye stdout/stderr ko patch karo
    this._patchTerminal();

    this.intervalId = setInterval(() => {
      this._sendHeartbeat();
    }, this.sdk.config.heartbeatIntervalMs);

    this.flushIntervalId = setInterval(() => {
      this._flushLogBuffer();
    }, this.sdk.config.flushIntervalMs);

    // Ensure the heartbeat doesn't prevent process from exiting
    this.intervalId.unref();

    if (this.flushIntervalId) {
      this.flushIntervalId.unref();
    }

    this.sdk.logger.debug("[IW] Heartbeat manager started", {
      heartbeatMs: this.sdk.config.heartbeatIntervalMs,
      flushMs: this.sdk.config.flushIntervalMs,
    });
  }

  /**
   * Captures everything printed to the console (stdout/stderr)
   */
  private _patchTerminal(): void {
    const self = this;
    const originalStdoutWrite = process.stdout.write.bind(process.stdout);
    const originalStderrWrite = process.stderr.write.bind(process.stderr);

    // Patch stdout
    // @ts-ignore
    process.stdout.write = function (
      chunk: any,
      encoding?: any,
      callback?: any,
    ) {
      const data =
        typeof chunk === "string" ? chunk : chunk?.toString(encoding || "utf8");

      if (data) {
        self._addToBuffer(data, "STDOUT");
      }
      return originalStdoutWrite(chunk, encoding, callback);
    };

    // Patch stderr
    // @ts-ignore
    process.stderr.write = function (
      chunk: any,
      encoding?: any,
      callback?: any,
    ) {
      const data =
        typeof chunk === "string" ? chunk : chunk?.toString(encoding || "utf8");

      if (data) {
        self._addToBuffer(data, "STDERR");
      }
      return originalStderrWrite(chunk, encoding, callback);
    };
  }

  private _addToBuffer(text: string, source: string): void {
    const lines = text.split("\n").filter((l) => l.trim().length > 0);

    for (const line of lines) {
      // 1. String-based filter (development/pretty print)
      if (line.includes("[IW]")) continue;

      // 2. JSON-based filter (production)
      if (line.startsWith("{") && line.endsWith("}")) {
        try {
          const parsed = JSON.parse(line);
          if (parsed._iw === true) continue;
        } catch (e) {
          // Not a valid SDK log, continue capturing
        }
      }

      const event = this._toLogEvent(line, source);

      if (event.deliveryMode === "critical") {
        this._sendCriticalLog(event);
        continue;
      }

      if (this.logBuffer.length >= this.maxBufferSize) {
        this.logBuffer.shift();
      }

      this.logBuffer.push(event);
    }
  }

  private _toLogEvent(line: string, source: string): LogEvent {
    const lowered = line.toLowerCase();
    const isCritical =
      source === "STDERR" ||
      lowered.includes("error") ||
      lowered.includes("exception") ||
      lowered.includes("fatal");

    return {
      message: `[${source}] ${line}`,
      level: isCritical ? "error" : "info",
      severity: isCritical ? "SEV2" : "SEV3",
      service: this.sdk.config.serverId,
      context: {
        environment: this.sdk.config.environment,
        source,
      },
      timestamp: new Date().toISOString(),
      deliveryMode: isCritical ? "critical" : "normal",
    };
  }

  private _sendCriticalLog(event: LogEvent): void {
    this.sdk.transport.sendLogs([event]).catch(() => {
      // Never throw from terminal patch path.
    });
  }

  private _flushLogBuffer(): void {
    if (this.logBuffer.length === 0) return;

    const batch = this.logBuffer.splice(0, this.logBuffer.length);
    this.sdk.transport.sendLogs(batch).catch(() => {
      // Non-blocking telemetry path.
    });
  }

  private async _sendHeartbeat(): Promise<void> {
    const payload = {
      id: uuidv4(),
      type: "heartbeat",
      timestamp: new Date().toISOString(),
      serverId: this.sdk.config.serverId,
      environment: this.sdk.config.environment,
      metrics: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage(),
      },
    };

    try {
      // Transport use karke platform pe bhejo
      // Heartbeat ke liye /api/heartbeat use karenge (or can use /api/incidents with type)
      await this.sdk.transport.sendHeartbeat(payload);
    } catch (err) {
      // Silently fail to avoid infinite recursion if logger fails
    }
  }

  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    if (this.flushIntervalId) {
      clearInterval(this.flushIntervalId);
      this.flushIntervalId = undefined;
    }

    this._flushLogBuffer();
  }
}
