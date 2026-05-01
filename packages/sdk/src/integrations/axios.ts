import { SDKInterface } from "../core/memory-monitor";

export class AxiosIntegration {
  constructor(private sdk: SDKInterface) {}

  /**
   * Global Axios instance patch karo.
   * Automatically call hota hai SDK._bootstrap() se.
   */
  patch(): void {
    let axios: any;
    try {
      // @ts-ignore
      axios = require("axios");
    } catch {
      this.sdk.logger.debug("[IW] Axios not found — skipping integration");
      return;
    }

    this.patchInstance(axios);
    this.sdk.logger.debug("[IW] Axios global instance patched");
  }

  /**
   * Kisi bhi Axios instance pe interceptors add karo.
   * Custom instances ke liye manually call karo.
   */
  patchInstance(axiosInstance: any): void {
    const sdk = this.sdk;

    // ── Request interceptor ──────────────────────────────────────────────
    axiosInstance.interceptors.request.use(
      (requestConfig: any) => {
        requestConfig._iwStartTime = Date.now();

        // @ts-ignore
        sdk.addBreadcrumb("http.outgoing", {
          method: requestConfig.method?.toUpperCase(),
          url: requestConfig.url,
          baseURL: requestConfig.baseURL,
        });

        return requestConfig;
      },
      (error: any) => Promise.reject(error),
    );

    // ── Response interceptor ─────────────────────────────────────────────
    axiosInstance.interceptors.response.use(
      // Success response
      (response: any) => {
        const duration =
          Date.now() - (response.config._iwStartTime || Date.now());
        const url = response.config.url;

        // @ts-ignore
        sdk.addBreadcrumb("http.response", {
          method: response.config.method?.toUpperCase(),
          url,
          status: response.status,
          duration,
        });

        // Slow response → warn
        if (duration > sdk.config.slowThresholdMs) {
          sdk.logger.warn(`[IW] Slow outgoing request: ${url} ${duration}ms`);
        }

        return response;
      },

      // Error response
      async (error: any) => {
        const duration =
          Date.now() - (error.config?._iwStartTime || Date.now());
        const url = error.config?.url || "unknown";
        const status = error.response?.status;
        const code = error.code; // ECONNREFUSED, ETIMEDOUT etc.

        // @ts-ignore
        sdk.addBreadcrumb(
          "http.error",
          {
            method: error.config?.method?.toUpperCase(),
            url,
            status,
            code,
            duration,
            message: error.message,
          },
          "error",
        );

        // Network errors → SEV2 incident (server unreachable)
        if (!error.response && code) {
          await sdk
            .captureIncident({
              title: `Network error: ${code} calling ${url}`,
              severity: "SEV2",
              tags: ["axios", "network-error", code],
              context: { url, method: error.config?.method, code, duration },
            })
            .catch(() => {});
        }

        // 5xx from external service → SEV2
        if (status >= 500) {
          await sdk
            .captureIncident({
              title: `Upstream error: ${status} from ${url}`,
              severity: "SEV2",
              tags: ["axios", "upstream-error", `status-${status}`],
              context: { url, status, duration },
            })
            .catch(() => {});
        }

        return Promise.reject(error);
      },
    );
  }
}
