const express = require("express");

(async () => {
  const { init, isInitialized } = require("@aditya_kbr01/incidentwatch-sdk");

  const iw = await init({
    apiKey: "5498877e64349a39154a3e5a370ffd0c887a5300d05af348532e594ac4c32ee5",
    serverId: "final",
    platformUrl: "http://localhost:8000/api/v1/sdk",
    debug: true,
    integrations: {
      express: true,
      axios: true,
      fetch: true,
      console: true,
    },
  });

  const app = express();
  app.use(express.json());

  const axios = require("axios");

  // 🟢 A1
  app.get("/health", (req, res) => {
    console.log("Health check");
    res.json({ ok: true, sdk: isInitialized() });
  });

  // 🟢 A2
  app.get("/error-sync", (req, res) => {
    throw new Error("Sync error");
  });

  // 🟢 A3
  app.get("/error-async", async (req, res) => {
    throw new Error("Async error");
  });

  // 🟢 A4
  app.get("/error-next", (req, res, next) => {
    const err = new Error("Next error");
    err.status = 500;
    next(err);
  });

  // 🟢 A5
  app.get("/error-next-404", (req, res, next) => {
    const err = new Error("Not found");
    err.status = 404;
    next(err);
  });

  // 🟢 B1
  app.get("/error-rejection", (req, res) => {
    Promise.reject(new Error("Unhandled rejection"));
    res.send("Triggered rejection");
  });

  // 🟢 C1 (FIXED)
  app.get("/slow-operation", async (req, res) => {
    const done = iw.startTimer("slow-op");
    await new Promise((r) => setTimeout(r, 2000));
    done();
    res.json({ message: "Slow done" });
  });

  // 🟢 D1
  app.get("/axios-network", async (req, res) => {
    try {
      await axios.get("http://localhost:1/fake");
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // 🟢 D2
  app.get("/axios-200", async (req, res) => {
    try {
      await axios.get("https://jsonplaceholder.typicode.com/posts/1");
      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  // 🟢 E1
  app.get("/fetch-network", async (req, res) => {
    try {
      await fetch("http://localhost:1/fake");
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // 🟢 F1
  app.post("/manual-incident", async (req, res) => {
    await iw.captureIncident({
      title: "Manual incident",
      severity: "SEV3",
    });
    res.json({ sent: true });
  });

  // 🟢 F2
  app.get("/breadcrumbs", async (req, res) => {
    iw.addBreadcrumb("step1");
    iw.addBreadcrumb("step2");

    await iw.captureIncident({
      title: "Breadcrumb test",
      severity: "SEV2",
    });

    res.json({ ok: true });
  });

  // 🟢 F3
  app.get("/console-error", (req, res) => {
    console.error(new Error("Console error"));
    res.send("done");
  });

  // 🟢 F4
  app.get("/ignored-error", async (req, res) => {
    const err = new Error("read ECONNRESET");
    await iw.captureError(err);
    res.json({ ok: true });
  });

  // 🟢 G1
  app.get("/custom-severity", async (req, res) => {
    await iw.captureError(new Error("SEV1"), { severity: "SEV1" });
    await iw.captureError(new Error("SEV2"), { severity: "SEV2" });
    await iw.captureError(new Error("SEV3"), { severity: "SEV3" });

    res.json({ ok: true });
  });

  // 🟢 H1
  app.get("/capture-message", async (req, res) => {
    await iw.captureMessage("Test message", { severity: "SEV2" });
    res.json({ ok: true });
  });

  // 🟢 H2
  app.get("/with-scope", async (req, res) => {
    await iw.withScope({ tags: ["scope-test"] }, async () => {
      await iw.captureMessage("Scoped message");
    });
    res.json({ ok: true });
  });

  // 🟢 H3
  app.get("/set-tag-dynamic", async (req, res) => {
    iw.setTag("dynamic", "true");
    await iw.captureMessage("Dynamic tag test");
    res.json({ ok: true });
  });

  // 🟢 H4
  app.get("/wrap-async", async (req, res) => {
    const fn = iw.wrapAsync(async () => {
      throw new Error("Wrapped async error");
    });

    try {
      await fn();
    } catch { }
    res.json({ ok: true });
  });

  // 🟢 H5
  app.get("/request-id", async (req, res) => {
    const result = iw.runWithRequestId("req-123", async () => {
      await iw.captureMessage("Request ID test");
      return iw.getCurrentRequestId();
    });

    res.json({ requestId: result });
  });

  // 🟢 H6
  app.get("/status", (req, res) => {
    res.json({ status: iw.getStatus() });
  });

  // 🟢 H7
  app.get("/toggle-integrations", (req, res) => {
    iw.disableIntegration("console");
    iw.enableIntegration("console");
    res.json({ ok: true });
  });

  // ❌ 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.listen(4000, () => {
    console.log("Server running http://localhost:4000");
  });
})();