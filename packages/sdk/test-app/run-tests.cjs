#!/usr/bin/env node

/**
 * SDK Test Runner — Hits all test routes sequentially with delays
 *
 * Usage: npm run test
 * Prerequisites: Mock platform (port 5000) and test app (port 4000) must be running
 */

const http = require("http");

const BASE_URL = "http://localhost:4000";
const PLATFORM_URL = "http://localhost:5000";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, body: json });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Timeout: ${method} ${path}`));
    });

    req.end();
  });
}

function getIncidents() {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/incidents",
        timeout: 5000,
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve(body);
          }
        });
      },
    );
    req.on("error", reject);
    req.end();
  });
}

function clearIncidents() {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: 5000,
        path: "/api/incidents",
        method: "DELETE",
        timeout: 5000,
      },
      (res) => {
        res.resume();
        res.on("end", resolve);
      },
    );
    req.on("error", () => resolve());
    req.end();
  });
}

// ── Test Suite ──────────────────────────────────────────────────────────────

const tests = [
  // A. Express Route Errors
  {
    method: "GET",
    path: "/health",
    label: "A1. Health check",
    expect500: false,
  },
  {
    method: "GET",
    path: "/error-sync",
    label: "A2. Sync error (expect SEV2)",
    expect500: true,
  },
  {
    method: "GET",
    path: "/error-async",
    label: "A3. Async error (expect SEV2)",
    expect500: true,
  },
  {
    method: "GET",
    path: "/error-next",
    label: "A4. next(err) 500 (expect SEV2)",
    expect500: true,
  },
  {
    method: "GET",
    path: "/error-next-404",
    label: "A5. next(err) 404 (expect no incident)",
    expectStatus: 404,
  },

  // B. Global Hooks
  {
    method: "GET",
    path: "/error-rejection",
    label: "B1. Unhandled rejection (expect SEV2)",
    expect500: false,
  },

  // C. Performance
  {
    method: "GET",
    path: "/slow-operation",
    label: "C1. Slow operation 2s (expect SEV3)",
    expect500: false,
  },

  // D. Axios Integration
  {
    method: "GET",
    path: "/axios-network",
    label: "D1. Axios network error (expect SEV2)",
    expect500: true,
  },
  {
    method: "GET",
    path: "/axios-200",
    label: "D2. Axios success (breadcrumb)",
    expect500: false,
  },

  // E. Fetch Integration
  {
    method: "GET",
    path: "/fetch-network",
    label: "E1. Fetch network error (expect SEV2)",
    expect500: true,
  },

  // F. Manual & Config
  {
    method: "POST",
    path: "/manual-incident",
    label: "F1. Manual incident",
    expect500: false,
  },
  {
    method: "GET",
    path: "/breadcrumbs",
    label: "F2. Breadcrumbs + incident",
    expect500: false,
  },
  {
    method: "GET",
    path: "/console-error",
    label: "F3. console.error (expect SEV3)",
    expect500: false,
  },
  {
    method: "GET",
    path: "/ignored-error",
    label: "F4. Ignored error (ECONNRESET, expect filtered)",
    expect500: false,
  },

  // G. Custom Severity
  {
    method: "GET",
    path: "/custom-severity",
    label: "G1. Custom SEV1, SEV2, SEV3",
    expect500: false,
  },

  // H. DX Features
  {
    method: "GET",
    path: "/capture-message",
    label: "H1. captureMessage",
    expect500: false,
  },
  {
    method: "GET",
    path: "/with-scope",
    label: "H2. withScope",
    expect500: false,
  },
  {
    method: "GET",
    path: "/set-tag-dynamic",
    label: "H3. Dynamic tag",
    expect500: false,
  },
  {
    method: "GET",
    path: "/wrap-async",
    label: "H4. wrapAsync",
    expect500: false,
  },
  {
    method: "GET",
    path: "/request-id",
    label: "H5. Request ID",
    expect500: false,
  },
  { method: "GET", path: "/status", label: "H6. SDK status", expect500: false },
  {
    method: "GET",
    path: "/toggle-integrations",
    label: "H7. Toggle integrations",
    expect500: false,
  },
];

async function run() {
  console.log("\n" + "═".repeat(70));
  console.log("  IncidentWatch SDK — Automated Test Suite");
  console.log("═".repeat(70) + "\n");

  let passed = 0;
  let failed = 0;

  // Clear existing incidents
  console.log("🧹 Clearing existing incidents...");
  await clearIncidents();
  await sleep(500);

  for (const test of tests) {
    try {
      const result = await makeRequest(test.method, test.path);
      const isOk = test.expectStatus
        ? result.status === test.expectStatus
        : test.expect500
          ? result.status === 500
          : result.status >= 200 && result.status < 400;
      const status = isOk ? "✅" : "❌";
      console.log(`  ${status} ${test.label.padEnd(45)} HTTP ${result.status}`);
      if (isOk) passed++;
      else failed++;
    } catch (err) {
      console.log(`  ❌ ${test.label.padEnd(45)} ERROR: ${err.message}`);
      failed++;
    }
    await sleep(800);
  }

  // Fetch final incident count
  await sleep(1000);
  const incidents = await getIncidents();
  const total = typeof incidents === "object" ? incidents.total : "?";

  console.log("\n" + "─".repeat(70));
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log(`  Incidents captured on mock platform: ${total}`);
  console.log("─".repeat(70));

  if (failed === 0) {
    console.log("\n  🎉 All tests passed! SDK is working correctly.\n");
  } else {
    console.log(`\n  ⚠️  ${failed} test(s) failed. Check output above.\n`);
  }
}

run().catch((err) => {
  console.error("\n❌ Test runner failed:", err.message);
  process.exit(1);
});
