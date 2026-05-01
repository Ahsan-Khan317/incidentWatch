import axios, { AxiosInstance } from "axios";
import PQueue from "p-queue";
import { SDKConfig, Incident } from "../types";
import { Logger } from "winston";

export class HttpTransport {
  private queue: PQueue;
  private client: AxiosInstance;
  private _failures = 0;
  private _circuitOpen = false;

  constructor(
    private config: SDKConfig,
    private logger: Logger,
  ) {
    // Max 5 concurrent API calls
    this.queue = new PQueue({ concurrency: 5 });

    // Axios instance — dedicated for SDK transport
    this.client = axios.create({
      baseURL: config.platformUrl,
      timeout: config.transport.timeout,
      headers: {
        "Content-Type": "application/json",
        "X-IW-API-Key": config.apiKey,
        "X-IW-Server-ID": config.serverId,
        "X-IW-SDK-Version": "1.0.0", // Will be injected by build
      },
    });
  }

  /**
   * Incident platform pe bhejo.
   * @param incident — IncidentBuilder se aaya payload
   */
  async send(incident: Incident): Promise<{ incidentId: string } | null> {
    if (this._circuitOpen) {
      this.logger.warn(
        "[IW] Circuit open — dropping incident (platform unreachable)",
      );
      return null;
    }

    return this.queue.add(() => this._sendWithRetry(incident)) as Promise<{
      incidentId: string;
    } | null>;
  }

  /**
   * Heartbeat data bhejo (with terminal logs).
   * @param data — Heartbeat payload
   */
  async sendHeartbeat(data: any): Promise<void> {
    if (this._circuitOpen) return;

    this.queue.add(async () => {
      try {
        await this.client.post("/api/heartbeat", data);
      } catch (err) {
        // Heartbeat failure is non-critical, don't trigger circuit breaker for now
      }
    });
  }

  /**
   * Queue mein sab pending incidents flush karo.
   * Shutdown pe call hota hai.
   */
  async flush(): Promise<void> {
    await this.queue.onIdle();
  }

  /**
   * Circuit breaker state check karo.
   */
  isCircuitOpen(): boolean {
    return this._circuitOpen;
  }

  private async _sendWithRetry(
    incident: Incident,
  ): Promise<{ incidentId: string } | null> {
    const { retries, retryDelay } = this.config.transport;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await this.client.post("/api/incidents", incident);
        this._failures = 0; // success — circuit reset
        this.logger.debug(`[IW] Incident sent: ${incident.id}`);
        return res.data;
      } catch (err: any) {
        const isLast = attempt === retries;

        if (isLast) {
          this._failures++;
          this.logger.warn(
            `[IW] Failed to send incident after ${retries} retries`,
            {
              incidentId: incident.id,
              error: err.message,
            },
          );

          // 5+ consecutive failures → circuit open karo
          if (this._failures >= 5) {
            this._tripCircuit();
          }
          return null;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = retryDelay * Math.pow(2, attempt - 1);
        await this._sleep(delay);
      }
    }
    return null;
  }

  private _tripCircuit(): void {
    this._circuitOpen = true;
    this.logger.error(
      "[IW] Circuit breaker tripped — platform unreachable. Will retry in 60s",
    );

    // 60 seconds baad circuit reset karo
    setTimeout(() => {
      this._circuitOpen = false;
      this._failures = 0;
      this.logger.info(
        "[IW] Circuit breaker reset — retrying platform connection",
      );
    }, 60_000);
  }

  private _sleep(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
  }
}
