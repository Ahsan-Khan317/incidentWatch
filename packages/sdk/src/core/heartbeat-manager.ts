import { IncidentWatchSDK } from "../sdk";
import { v4 as uuidv4 } from "uuid";

export class HeartbeatManager {
  private sdk: IncidentWatchSDK;
  private intervalId?: NodeJS.Timeout;
  private logBuffer: string[] = [];
  private maxBufferSize = 500; // Limit to 500 lines to prevent memory bloat

  constructor(sdk: IncidentWatchSDK) {
    this.sdk = sdk;
  }

  public start(): void {
    if (this.intervalId) return;

    // Terminal logs capture karne ke liye stdout/stderr ko patch karo
    this._patchTerminal();

    // 5 seconds interval (as requested by user)
    this.intervalId = setInterval(() => {
      this._sendHeartbeat();
    }, this.sdk.config.heartbeatIntervalMs);

    // Ensure the heartbeat doesn't prevent process from exiting
    this.intervalId.unref();

    this.sdk.logger.debug("[IW] Heartbeat manager started (5s interval)");
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
      if (typeof chunk === "string") {
        self._addToBuffer(chunk, "STDOUT");
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
      if (typeof chunk === "string") {
        self._addToBuffer(chunk, "STDERR");
      }
      return originalStderrWrite(chunk, encoding, callback);
    };
  }

  private _addToBuffer(text: string, source: string): void {
    const lines = text.split("\n").filter((l) => l.trim().length > 0);
    for (const line of lines) {
      if (this.logBuffer.length >= this.maxBufferSize) {
        this.logBuffer.shift(); // Remove oldest line if buffer is full
      }
      this.logBuffer.push(`[${source}] ${line}`);
    }
  }

  private async _sendHeartbeat(): Promise<void> {
    if (this.logBuffer.length === 0) {
      // Agar koi naye logs nahi hain, toh basic heartbeat bhej do
      // (Optional: can be skipped if user ONLY wants logs)
    }

    const logsToSend = [...this.logBuffer];
    this.logBuffer = []; // Clear buffer after snapshot

    const payload = {
      id: uuidv4(),
      type: "heartbeat",
      timestamp: new Date().toISOString(),
      serverId: this.sdk.config.serverId,
      environment: this.sdk.config.environment,
      logs: logsToSend,
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
  }
}
