/**
 * Test Express App — Comprehensive SDK Verification
 *
 * Covers ALL SDK capabilities including new DX features:
 *   - Express route errors (sync, async, next)
 *   - Global hooks (uncaught exception, unhandled rejection)
 *   - Axios/Fetch integration (network error, 500, success)
 *   - Performance monitoring (slow operations)
 *   - Memory monitoring (pressure alert)
 *   - Manual incidents, breadcrumbs, console errors
 *   - Error filtering (ignoreErrors)
 *   - NEW: captureMessage, setTag, setContext, setUser, withScope
 *   - NEW: wrapAsync, runWithRequestId, getStatus, shutdown
 *
 * Prerequisites:
 *   1. cd packages/sdk && bun run build
 *   2. Start mock platform:  node mock-platform.js      (port 5000)
 *   3. Start test app:       node test-app.js           (port 4000)
 */

const express = require("express");

// ── Initialize SDK ──────────────────────────────────────────────────────────

(async () => {
  const {
    init,
    getInstance,
    isInitialized,
    shutdown,
  } = require("@incidentwatch/sdk");

  try {
    const iw = await init({
      apiKey:
        "8a90f6ccde53c7ad500c150f68c2b33923526913d7b284ef29732eeada51d6e5", // Replace with real key from DB for full test
      serverId: "test-server-01",
      platformUrl: "http://localhost:8000/api/v1/sdk",
      debug: true,
      slowThresholdMs: 10000,
      heartbeatIntervalMs: 10000,
      integrations: {
        express: true,
        axios: true,
        fetch: true,
      },
    });

    const app = express();
    const log = iw.log;

    app.use(express.json());

    // Set global tags and context that apply to all incidents
    iw.setTag("app", "test-app");
    iw.setTag("team", "backend");
    iw.setContext("appVersion", "1.0.0-test");
    iw.setUser({ id: "test-user-1", email: "dev@test.com" });

    // ── ROUTES: A. Express Route Errors ─────────────────────────────────────────

    app.get("/health", (req, res) => {
      log.info("[TEST] /health — normal request");
      res.json({
        status: "ok",
        message: "SDK is watching...",
        sdkInitialized: isInitialized(),
      });
    });

    app.get("/error-sync", (req, res) => {
      log.info("[TEST] /error-sync — sync throw, expect SEV2");
      throw new Error("Synchronous route crash — /error-sync");
    });

    app.get("/error-async", async (req, res) => {
      log.info("[TEST] /error-async — async throw, expect SEV2");
      throw new Error("Asynchronous route failure — /error-async");
    });

    app.get("/error-next", (req, res, next) => {
      log.info("[TEST] /error-next — next(err) with 500, expect SEV2");
      const err = new Error("Next error — server-side failure");
      err.status = 500;
      next(err);
    });

    app.get("/error-next-404", (req, res, next) => {
      log.info(
        "[TEST] /error-next-404 — next(err) with 404, expect NO incident from middleware",
      );
      const err = new Error("Client-side not found");
      err.status = 404;
      next(err);
    });

    // ── ROUTES: B. Global Hooks ─────────────────────────────────────────────────

    app.get("/error-rejection", (req, res) => {
      log.info("[TEST] /error-rejection — unhandled rejection, expect SEV2");
      Promise.reject(
        new Error("Unhandled promise rejection — /error-rejection"),
      );
      res.json({
        message: "Promise rejected — check console for unhandledRejection",
      });
    });

    app.get("/crash", (req, res) => {
      log.warn("[TEST] /crash — uncaughtException, expect SEV1 + process exit");
      res.json({ message: "Crashing in 500ms..." });
      setTimeout(() => {
        process.emit(
          "uncaughtException",
          new Error("CRITICAL SYSTEM FAILURE — simulated crash"),
        );
      }, 500);
    });

    // ── ROUTES: C. Performance ──────────────────────────────────────────────────

    app.get("/slow-operation", async (req, res) => {
      log.info(
        "[TEST] /slow-operation — 2s delay with startTimer, expect SEV3",
      );
      const done = iw.startTimer("heavy-database-query", {
        route: "/slow-operation",
      });
      await new Promise((r) => setTimeout(r, 2000));
      const duration = done();
      res.json({ message: `That was slow! Took ${duration}ms` });
    });

    app.get("/memory-pressure", async (req, res) => {
      log.info(
        "[TEST] /memory-pressure — allocating ~600MB, expect SEV2 within 30s",
      );
      const buffers = [];
      const chunkSize = 100 * 1024 * 1024;
      for (let i = 0; i < 6; i++) {
        buffers.push(Buffer.alloc(chunkSize));
      }
      global._testMemoryPressure = buffers;
      res.json({
        message: "Allocated ~600MB. Memory monitor checks every 30s.",
        buffersAllocated: 6,
      });
    });

    // ── ROUTES: D. Axios Integration ────────────────────────────────────────────

    const axios = require("axios");

    app.get("/axios-network", async (req, res) => {
      log.info(
        "[TEST] /axios-network — unreachable port, expect SEV2 network error",
      );
      try {
        await axios.get("http://localhost:1/fake", { timeout: 2000 });
      } catch (err) {
        res
          .status(500)
          .json({ error: "Axios call failed", message: err.message });
        return;
      }
      res.json({ message: "Unexpected success" });
    });

    app.get("/axios-500", async (req, res) => {
      log.info(
        "[TEST] /axios-500 — mock 500 endpoint, expect SEV2 upstream error",
      );
      try {
        await axios.get("http://localhost:5000/api/fake-500", {
          timeout: 5000,
        });
      } catch (err) {
        res.status(500).json({ error: "Axios got 500", message: err.message });
        return;
      }
      res.json({ message: "Unexpected success" });
    });

    app.get("/axios-200", async (req, res) => {
      log.info("[TEST] /axios-200 — success, expect breadcrumb only");
      try {
        const response = await axios.get(
          "http://localhost:5000/api/incidents",
          {
            timeout: 5000,
          },
        );
        res.json({
          message: "Axios success",
          data: { total: response.data.total },
        });
      } catch (err) {
        res.status(500).json({ error: "Axios failed", message: err.message });
      }
    });

    // ── ROUTES: E. Fetch Integration ────────────────────────────────────────────

    app.get("/fetch-network", async (req, res) => {
      log.info("[TEST] /fetch-network — bad URL, expect SEV2 network error");
      try {
        await fetch("http://localhost:1/fake", {
          signal: AbortSignal.timeout(2000),
        });
      } catch (err) {
        res.status(500).json({ error: "Fetch failed", message: err.message });
        return;
      }
      res.json({ message: "Unexpected success" });
    });

    app.get("/fetch-500", async (req, res) => {
      log.info("[TEST] /fetch-500 — mock 500, expect SEV2 upstream error");
      try {
        const response = await fetch("http://localhost:5000/api/nonexistent", {
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) {
          res.status(500).json({
            error: `Fetch got ${response.status}`,
            status: response.status,
          });
          return;
        }
      } catch (err) {
        res.status(500).json({ error: "Fetch failed", message: err.message });
        return;
      }
      res.json({ message: "Unexpected success" });
    });

    // ── ROUTES: F. Manual & Config ──────────────────────────────────────────────

    app.post("/manual-incident", async (req, res) => {
      log.info("[TEST] /manual-incident — manual incident");
      const result = await iw.captureIncident({
        title: "Manual Alert from Test App",
        description: "User triggered this manually via POST /manual-incident",
        severity: "SEV3",
        tags: ["manual", "test"],
        context: { triggeredBy: "curl", route: "/manual-incident" },
      });
      res.json({ sent: true, result });
    });

    app.get("/breadcrumbs", async (req, res) => {
      log.info("[TEST] /breadcrumbs — 3 breadcrumbs + manual incident");
      iw.addBreadcrumb("test.step1", { action: "login_attempt" }, "info");
      iw.addBreadcrumb(
        "test.step2",
        { action: "db_query_failed", query: "SELECT *" },
        "warn",
      );
      iw.addBreadcrumb("test.step3", { action: "fallback_triggered" }, "error");

      await iw.captureIncident({
        title: "Incident with breadcrumbs",
        description:
          "Check the breadcrumbs array — should contain 3 entries above.",
        severity: "SEV2",
        tags: ["breadcrumbs", "test"],
      });

      res.json({ message: "3 breadcrumbs added + manual incident sent." });
    });

    app.get("/console-error", (req, res) => {
      log.info("[TEST] /console-error — console.error call, expect SEV3");
      console.error(new Error("Intentional console.error for SDK testing"));
      res.json({ message: "console.error called — check if SDK captured it" });
    });

    app.get("/ignored-error", async (req, res) => {
      log.info(
        "[TEST] /ignored-error — ECONNRESET, expect NO incident (filtered)",
      );
      const err = new Error("read ECONNRESET");
      const result = await iw.captureError(err, {
        severity: "SEV2",
        tags: ["should-be-ignored"],
      });
      res.json({
        message: "ECONNRESET error sent to SDK — should be ignored per config",
        captured: result !== null,
        result,
      });
    });

    // ── ROUTES: G. Custom Severity ──────────────────────────────────────────────

    app.get("/custom-severity", async (req, res) => {
      log.info("[TEST] /custom-severity — SEV1, SEV2, SEV3 errors");

      await iw.captureError(new Error("This is SEV1 — critical"), {
        severity: "SEV1",
        tags: ["custom", "sev1"],
      });

      await iw.captureError(new Error("This is SEV3 — low priority"), {
        severity: "SEV3",
        tags: ["custom", "sev3"],
      });

      await iw.captureError(new Error("This is SEV2 — default"), {
        tags: ["custom", "sev2-default"],
      });

      res.json({ message: "3 errors sent with SEV1, SEV3, SEV2" });
    });

    // ── ROUTES: H. NEW DX Features ──────────────────────────────────────────────

    app.get("/capture-message", async (req, res) => {
      log.info("[TEST] /capture-message — non-error incident");
      const result = await iw.captureMessage(
        "Database connection pool running low",
        {
          severity: "SEV2",
          tags: ["database", "pool-warning"],
          context: { poolSize: 10, activeConnections: 9 },
        },
      );
      res.json({ sent: true, result });
    });

    app.get("/with-scope", async (req, res) => {
      log.info("[TEST] /with-scope — isolated scope for operation");
      await iw.withScope(
        {
          tags: ["scoped-operation", "user-flow"],
          context: { flowName: "checkout", userId: "user-123" },
          user: { id: "user-123", email: "buyer@test.com" },
        },
        async () => {
          await iw.captureMessage(
            "Scoped incident — should have checkout context",
            {
              severity: "SEV3",
            },
          );
        },
      );
      res.json({
        message: "Scoped incident sent — check context and tags on platform",
      });
    });

    app.get("/set-tag-dynamic", async (req, res) => {
      log.info("[TEST] /set-tag-dynamic — dynamic tag during request");
      iw.setTag("request-type", "api-call");
      await iw.captureMessage("Incident with dynamic tag", {
        severity: "SEV3",
      });
      res.json({ message: "Tag set and incident sent" });
    });

    app.get("/wrap-async", async (req, res) => {
      log.info("[TEST] /wrap-async — wrapping non-Express async function");
      const riskyOperation = iw.wrapAsync(async (input) => {
        if (input === "fail") {
          throw new Error("Operation failed inside wrapped async function");
        }
        return { result: "success", input };
      }, "riskyOperation");

      try {
        await riskyOperation("fail");
      } catch (err) {
        // Error already captured by SDK wrapper
      }

      res.json({
        message: "Wrapped async error captured by SDK automatically",
      });
    });

    app.get("/request-id", async (req, res) => {
      log.info("[TEST] /request-id — tracking with request ID");
      const result = iw.runWithRequestId("req-abc-123", async () => {
        await iw.captureMessage("Incident with request ID", {
          severity: "SEV3",
          context: { operation: "checkout" },
        });
        return { requestId: iw.getCurrentRequestId() };
      });
      res.json({ message: "Incident sent with request ID", result });
    });

    app.get("/status", (req, res) => {
      log.info("[TEST] /status — SDK health status");
      res.json({
        message: "SDK Status",
        status: iw.getStatus(),
      });
    });

    app.post("/shutdown", async (req, res) => {
      log.info("[TEST] /shutdown — gracefully shutting down SDK");
      res.json({ message: "Shutting down..." });
      await shutdown();
      log.info("[TEST] SDK shut down complete");
    });

    app.get("/toggle-integrations", (req, res) => {
      log.info("[TEST] /toggle-integrations — disable/enable integrations");
      iw.disableIntegration("console");
      log.info("[TEST] Console integration disabled");
      iw.enableIntegration("console");
      log.info("[TEST] Console integration re-enabled");
      res.json({
        message: "Integrations toggled — check logs",
        integrations: iw.config.integrations,
      });
    });

    // ── Help Route ───────────────────────────────────────────────────────────────

    app.get("/help", (req, res) => {
      res.json({
        message: "IncidentWatch SDK — Comprehensive Test App",
        endpoints: {
          "A. Express Route Errors": {
            "GET  /health": "Normal request — no errors",
            "GET  /error-sync": "Sync throw — SEV2",
            "GET  /error-async": "Async throw — SEV2",
            "GET  /error-next": "next(err) 500 — SEV2",
            "GET  /error-next-404": "next(err) 404 — no middleware capture",
          },
          "B. Global Hooks": {
            "GET  /error-rejection": "Unhandled rejection — SEV2",
            "GET  /crash": "Uncaught exception — SEV1 + exit",
          },
          "C. Performance": {
            "GET  /slow-operation": "2s delay — SEV3 alert",
            "GET  /memory-pressure": "600MB alloc — SEV2 alert",
          },
          "D. Axios": {
            "GET  /axios-network": "Network error — SEV2",
            "GET  /axios-500": "Upstream 500 — SEV2",
            "GET  /axios-200": "Success — breadcrumb",
          },
          "E. Fetch": {
            "GET  /fetch-network": "Network error — SEV2",
            "GET  /fetch-500": "Upstream 500 — SEV2",
          },
          "F. Manual & Config": {
            "POST /manual-incident": "Manual incident",
            "GET  /breadcrumbs": "3 breadcrumbs + incident",
            "GET  /console-error": "console.error — SEV3",
            "GET  /ignored-error": "ECONNRESET — filtered",
          },
          "G. Custom Severity": {
            "GET  /custom-severity": "SEV1, SEV2, SEV3",
          },
          "H. NEW DX Features": {
            "GET  /capture-message": "Non-error incident",
            "GET  /with-scope": "Isolated scope operation",
            "GET  /set-tag-dynamic": "Dynamic tags at runtime",
            "GET  /wrap-async": "Auto-capture non-Express async",
            "GET  /request-id": "Request ID tracking",
            "GET  /status": "SDK health status",
            "POST /shutdown": "Graceful SDK shutdown",
            "GET  /toggle-integrations": "Enable/disable integrations",
          },
        },
      });
    });

    // ── 404 handler ──────────────────────────────────────────────────────────────

    app.use((req, res) => {
      res.status(404).json({
        error: "Not found",
        hint: "GET /help for all endpoints",
      });
    });

    // ── Server Start ─────────────────────────────────────────────────────────────

    const PORT = 4000;
    app.listen(PORT, () => {
      console.log("\n" + "═".repeat(60));
      console.log("[TEST APP] IncidentWatch SDK Test Server");
      console.log(`  Running on http://localhost:${PORT}`);
      console.log(`  SDK → http://localhost:8000/api/v1/sdk`);
      console.log("─".repeat(60));
      console.log("  Quick reference: GET /help");
      console.log("═".repeat(60) + "\n");
    });
  } catch (err) {
    console.error("\n❌ SDK Initialization Failed:", err.message);
    process.exit(1);
  }
})();
