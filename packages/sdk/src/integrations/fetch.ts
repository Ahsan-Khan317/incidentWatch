import { SDKInterface } from "../core/memory-monitor";

export class FetchIntegration {
  constructor(private sdk: SDKInterface) {}

  patch(): void {
    // global fetch sirf Node 18+ mein hai
    if (typeof globalThis.fetch !== "function") {
      this.sdk.logger.debug(
        "[IW] global fetch not available — skipping integration",
      );
      return;
    }

    const sdk = this.sdk;
    const originalFetch = globalThis.fetch.bind(globalThis);

    (globalThis as any).fetch = async (
      input: RequestInfo | URL,
      init: RequestInit = {},
    ) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      const method = (init.method || "GET").toUpperCase();
      const start = Date.now();

      // @ts-ignore
      sdk.addBreadcrumb("fetch.outgoing", { method, url });

      try {
        const response = await originalFetch(input, init);
        const duration = Date.now() - start;

        // @ts-ignore
        sdk.addBreadcrumb(
          "fetch.response",
          {
            method,
            url,
            status: response.status,
            duration,
          },
          response.ok ? "info" : "warn",
        );

        if (!response.ok && response.status >= 500) {
          await sdk
            .captureIncident({
              title: `Upstream error: ${response.status} from ${url}`,
              severity: "SEV2",
              tags: ["fetch", "upstream-error", `status-${response.status}`],
              context: { url, method, status: response.status, duration },
            })
            .catch(() => {});
        }

        return response;
      } catch (error: any) {
        const duration = Date.now() - start;
        // @ts-ignore
        sdk.addBreadcrumb(
          "fetch.error",
          { method, url, error: error.message, duration },
          "error",
        );

        await sdk
          .captureIncident({
            title: `Network error: fetch failed for ${url}`,
            severity: "SEV2",
            tags: ["fetch", "network-error"],
            context: { url, method, duration, error: error.message },
          })
          .catch(() => {});

        throw error;
      }
    };

    this.sdk.logger.debug("[IW] global fetch patched");
  }
}
