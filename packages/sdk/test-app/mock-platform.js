/**
 * Mock IncidentWatch Platform Server
 *
 * Receives incidents from the SDK, logs them, and provides an API to inspect captured incidents.
 *
 * Run: node mock-platform.js
 * Port: 5000
 */

const express = require("express");

const app = express();
app.use(express.json());

const capturedIncidents = [];

app.post("/api/incidents", (req, res) => {
  const incident = req.body;
  const receivedAt = new Date().toISOString();

  incident._receivedAt = receivedAt;
  capturedIncidents.push(incident);

  console.log("\n" + "═".repeat(80));
  console.log(
    `[MOCK PLATFORM] Incident #${capturedIncidents.length} received at ${receivedAt}`,
  );
  console.log("─".repeat(80));
  console.log(`  Title:       ${incident.title}`);
  console.log(`  Severity:    ${incident.severity}`);
  console.log(`  Source:      ${incident.source}`);
  console.log(`  Server:      ${incident.serverId}`);
  console.log(`  App:         ${incident.appName}`);
  console.log(`  Environment: ${incident.environment}`);
  console.log(`  Tags:        ${incident.tags.join(", ") || "(none)"}`);
  console.log(`  Breadcrumbs: ${incident.breadcrumbs?.length || 0}`);
  console.log("─".repeat(80));

  if (incident.description) {
    const desc =
      incident.description.length > 500
        ? incident.description.substring(0, 500) + "..."
        : incident.description;
    console.log(`  Description:\n${desc}`);
    console.log("─".repeat(80));
  }

  if (incident.runtime) {
    console.log(
      `  Runtime: Node ${incident.runtime.node} | PID ${incident.runtime.pid}`,
    );
    console.log("─".repeat(80));
  }

  if (incident.context && Object.keys(incident.context).length > 0) {
    console.log(`  Context: ${JSON.stringify(incident.context, null, 2)}`);
    console.log("─".repeat(80));
  }

  console.log("═".repeat(80));

  res.status(200).json({ incidentId: incident.id });
});

app.post("/api/heartbeat", (req, res) => {
  const heartbeat = req.body;
  const receivedAt = new Date().toISOString();

  console.log(
    `\n💓 [HEARTBEAT] Received from ${heartbeat.serverId} (${heartbeat.environment}) at ${receivedAt}`,
  );

  if (heartbeat.logs && heartbeat.logs.length > 0) {
    console.log(`   Captured Logs (${heartbeat.logs.length} lines):`);
    heartbeat.logs.forEach((log) => console.log(`   > ${log}`));
  } else {
    console.log(`   (No new logs)`);
  }

  if (heartbeat.metrics) {
    console.log(
      `   Uptime: ${Math.round(heartbeat.metrics.uptime)}s | Memory: ${Math.round(heartbeat.metrics.memory.heapUsed / 1024 / 1024)}MB`,
    );
  }

  res.status(200).json({ status: "ok" });
});

app.get("/api/incidents", (req, res) => {
  res.json({
    total: capturedIncidents.length,
    incidents: capturedIncidents.map((inc) => ({
      id: inc.id,
      title: inc.title,
      severity: inc.severity,
      source: inc.source,
      tags: inc.tags,
      timestamp: inc.timestamp,
      receivedAt: inc._receivedAt,
    })),
  });
});

app.get("/api/incidents/:id", (req, res) => {
  const incident = capturedIncidents.find((inc) => inc.id === req.params.id);
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }
  res.json(incident);
});

app.delete("/api/incidents", (req, res) => {
  capturedIncidents.length = 0;
  console.log("\n[MOCK PLATFORM] All incidents cleared.");
  res.json({ message: "All incidents cleared" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("\n" + "═".repeat(60));
  console.log("[MOCK PLATFORM] IncidentWatch mock platform running");
  console.log(`  POST /api/incidents      - Receive incidents from SDK`);
  console.log(`  GET  /api/incidents      - List all captured incidents`);
  console.log(`  GET  /api/incidents/:id  - Get single incident details`);
  console.log(`  DELETE /api/incidents    - Clear all incidents`);
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log("═".repeat(60) + "\n");
});
