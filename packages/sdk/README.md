# @incidentwatch/sdk

**One-line setup. Zero manual try/catch. Full incident coverage for Node.js apps.**

IncidentWatch SDK automatically captures crashes, errors, performance issues, and sends detailed incident reports to your platform. No need for `try-catch` everywhere.

---

## 🚀 Quick Start (30 seconds)

### 1. Install

```bash
npm install @incidentwatch/sdk
# or
bun add @incidentwatch/sdk
```

### 2. Initialize (top of your entry file)

```javascript
const { init } = require("@incidentwatch/sdk");

const iw = init({
  apiKey: "iw_xxxxx", // Get from https://app.incidentwatch.io
  serverId: "prod-api-1", // Your server identifier
});
```

**Done!** Your entire Express app is now monitored.

---

## 📋 Configuration

All options (required + optional):

| Property              | Type                    | Default                                                       | Description                              |
| --------------------- | ----------------------- | ------------------------------------------------------------- | ---------------------------------------- |
| `apiKey`              | `string`                | **Required**                                                  | Your API key                             |
| `serverId`            | `string`                | **Required**                                                  | Server name (e.g. `prod-api-1`)          |
| `platformUrl`         | `string`                | `http://localhost:8000/api/v1/sdk`                            | Custom platform URL                      |
| `environment`         | `string`                | `NODE_ENV`                                                    | `production`, `staging`, etc.            |
| `debug`               | `boolean`               | `false`                                                       | Enable verbose SDK logs                  |
| `slowThresholdMs`     | `number`                | `5000`                                                        | Alert threshold for slow operations (ms) |
| `breadcrumbLimit`     | `number`                | `50`                                                          | Max breadcrumbs per incident             |
| `heartbeatIntervalMs` | `number`                | `5000`                                                        | Heartbeat frequency (ms)                 |
| `ignoreErrors`        | `Array<string\|RegExp>` | `[ECONNRESET, ...]`                                           | Errors to skip                           |
| `integrations`        | `object`                | `{ express: true, axios: true, fetch: true, console: false }` | Toggle integrations                      |
| `logger`              | `object`                | `{ level: 'info', prettyPrint: true, filePath: null }`        | Winston logger config                    |
| `transport`           | `object`                | `{ timeout: 8000, retries: 3, retryDelay: 1000 }`             | HTTP transport config                    |

### Nested Config

```javascript
init({
  apiKey: "iw_xxxxx",
  serverId: "prod-1",
  integrations: {
    express: true,
    axios: true,
    fetch: true,
    console: true, // Capture console.error as incidents
  },
  logger: {
    level: "debug",
    prettyPrint: true,
    filePath: "/var/log/incidentwatch.log", // Optional file output
  },
  transport: {
    timeout: 5000,
    retries: 5,
    retryDelay: 2000,
  },
});
```

---

## 🛠️ How It Works

### 1. Auto-Patching (The "Magic")

SDK monkey-patches popular libraries so you don't write any extra code:

- **Express**: Intercepts `app.listen()` to auto-inject error middleware + Morgan logger. Catches sync throws, async route failures, and `next(err)` calls (5xx only).
- **Axios & Fetch**: Tracks all outgoing HTTP calls. Network errors → SEV2 incident. 5xx responses → SEV2 incident. Slow calls → warning log.

### 2. Global Hooks (System-Level Safety)

| Hook                          | Severity | Behavior                                |
| ----------------------------- | -------- | --------------------------------------- |
| `uncaughtException`           | SEV1     | Captures error, then exits process      |
| `unhandledRejection`          | SEV2     | Captures error, process continues       |
| `SIGTERM` / `SIGINT`          | —        | Flushes pending incidents, clean exit   |
| `MaxListenersExceededWarning` | SEV3     | Captures as incident (memory leak risk) |

### 3. Breadcrumbs

Every incident includes the last 50 events leading up to it:

| Breadcrumb                          | When                     |
| ----------------------------------- | ------------------------ |
| `http.request`                      | Incoming Express request |
| `http.error`                        | Express error (5xx)      |
| `http.outgoing` / `http.response`   | Axios call               |
| `fetch.outgoing` / `fetch.response` | Fetch call               |
| `timer.start` / `timer.end`         | `startTimer()` call      |
| `async.start` / `async.error`       | `wrapAsync()` call       |

### 4. Circuit Breaker

If the platform is unreachable for 5+ consecutive attempts, the SDK opens its circuit breaker to prevent blocking your app. Resets after 60 seconds.

---

## 💡 DX Features (Developer Experience)

### captureMessage() — Log non-error incidents

```javascript
await iw.captureMessage("Database pool running low", {
  severity: "SEV2",
  tags: ["database", "pool"],
  context: { poolSize: 10, active: 9 },
});
```

### setTag() / setContext() / setUser() — Global metadata

These apply to **all subsequent incidents**:

```javascript
iw.setTag("team", "backend");
iw.setTag("version", "2.1.0");
iw.setContext("region", "us-east-1");
iw.setUser({ id: "user-123", email: "dev@test.com" });
```

### withScope() — Isolated context for one operation

```javascript
await iw.withScope(
  {
    tags: ["checkout-flow"],
    context: { cartId: "cart-456" },
    user: { id: "buyer-789" },
  },
  async () => {
    await processPayment(); // Any incidents here get checkout context
  },
);
// Scope resets after fn completes
```

### wrapAsync() — Auto-catch non-Express async functions

```javascript
const sendEmail = iw.wrapAsync(async (to, body) => {
  await mailer.send(to, body); // If this throws → SDK captures it
}, "sendEmail");

await sendEmail("user@test.com", { subject: "Hello" });
```

### startTimer() — Performance monitoring

```javascript
const done = iw.startTimer("database-query", { table: "users" });
const results = await db.query("SELECT * FROM users");
done(); // If > slowThresholdMs → SEV3 incident auto-created
```

### runWithRequestId() — Correlate incidents to requests

```javascript
app.use((req, res, next) => {
  iw.runWithRequestId(req.headers["x-request-id"] || uuid(), next);
});

// All incidents during this request will have requestId in context
```

### getStatus() — SDK health check

```javascript
const status = iw.getStatus();
// Returns:
// {
//   initialized: true,
//   version: '1.0.0',
//   integrations: { express: true, axios: true, fetch: true, console: false },
//   circuitBreakerOpen: false,
//   config: { environment: 'production', serverId: 'prod-1', ... },
// }
```

### shutdown() — Graceful cleanup

```javascript
// In your shutdown handler
process.on("SIGTERM", async () => {
  await require("@incidentwatch/sdk").shutdown();
  process.exit(0);
});
```

### Integration Toggles

```javascript
// Runtime toggle
iw.disableIntegration("console"); // Stop capturing console.error
iw.enableIntegration("console"); // Re-enable

// All at once
iw.disableAllIntegrations();
iw.enableAllIntegrations();
```

### clearScope() — Reset global tags/context

```javascript
iw.clearScope(); // Removes all global tags, context, and user
```

---

## 📊 Severity Levels

| Level  | Meaning  | Used For                                  |
| ------ | -------- | ----------------------------------------- |
| `SEV1` | Critical | Process crashes, uncaught exceptions      |
| `SEV2` | High     | Unhandled rejections, network errors, 5xx |
| `SEV3` | Medium   | Slow operations, warnings, manual alerts  |

---

## 📦 Exports

```javascript
const {
  init,              // (config) => IncidentWatchSDK
  getInstance,       // () => IncidentWatchSDK (throws if not initialized)
  isInitialized,     // () => boolean
  shutdown,          // () => Promise<void>
  expressMiddleware, // () => Express middleware (for manual use)
  IncidentWatchSDK,  // Class (for TypeScript)
} = require('@incidentwatch/sdk');

// Types (TypeScript)
import type {
  UserConfig, IncidentData, CaptureErrorOptions,
  Severity, UserInfo, Scope, SDKStatus,
  Breadcrumb, Incident,
} from '@incidentwatch/sdk';
```

---

## 🔍 Breadcrumb Types

SDK automatically tracks:

| Category                                    | Trigger                  |
| ------------------------------------------- | ------------------------ |
| `http.request`                              | Incoming Express request |
| `http.error`                                | Express 5xx error        |
| `http.outgoing` / `http.response`           | Axios request/response   |
| `fetch.outgoing` / `fetch.response`         | Fetch request/response   |
| `timer.start` / `timer.end`                 | `startTimer()`           |
| `async.start` / `async.end` / `async.error` | `wrapAsync()`            |

### Manual Breadcrumbs

```javascript
iw.addBreadcrumb("user.login", { email: "dev@test.com" }, "info");
iw.addBreadcrumb(
  "payment.failed",
  { amount: 100, reason: "card_declined" },
  "error",
);
```

---

## 🚦 Expected Flow

1. **Error Trigger**: Crash, slow operation, or manual capture
2. **Auto Capture**: SDK gathers stack trace, memory, breadcrumbs, context
3. **Queue**: Incident queued with retry logic
4. **Send**: HTTP POST to platform with exponential backoff
5. **Circuit Breaker**: Opens after 5 failures, resets after 60s

---

## 📂 Project Structure

```
src/
├── index.ts              # Entry point (init, getInstance, shutdown)
├── sdk.ts                # Main SDK class
├── global-hooks.ts       # uncaughtException, unhandledRejection, signals
├── core/
│   ├── transport.ts       # HTTP transport with queue + circuit breaker
│   ├── incident-builder.ts # Incident payload construction
│   ├── breadcrumb-manager.ts # Breadcrumb storage (FIFO, limit enforced)
│   ├── memory-monitor.ts   # Heap/RSS monitoring (30s interval)
│   └── heartbeat-manager.ts # Platform heartbeat with log streaming
├── integrations/
│   ├── express.ts         # Express auto-registration + error middleware
│   ├── axios.ts           # Axios interceptor (request + response)
│   └── fetch.ts           # global fetch wrapper
├── utils/
│   ├── config.ts          # Config validation + defaults
│   └── logger.ts          # Winston logger (dev/prod formats)
└── types/
    └── index.ts           # All TypeScript interfaces
```

---

## 🧪 Testing

A comprehensive test app is included:

```bash
cd packages/sdk
bun run build

cd test-app
npm install

# Terminal 1
node mock-platform.js   # Mock platform on port 5000

# Terminal 2
node test-app.js        # Test app on port 4000
```

Then test all routes:

```bash
# See all endpoints
curl http://localhost:4000/help

# Test various endpoints
curl http://localhost:4000/health                    # Normal request
curl http://localhost:4000/error-sync              # Sync error → SEV2
curl http://localhost:4000/capture-message        # Non-error incident
curl http://localhost:4000/slow-operation       # Slow op → SEV3
curl http://localhost:4000/manual-incident -X POST  # Manual incident

# Check captured incidents
curl http://localhost:5000/api/incidents
```

---

## 📺 Terminal Logs — What You See

When you run your app with the SDK, here's what the logs look like:

### 1. SDK Initialization

```
14:02:15 [IW] info: IncidentWatch SDK initializing... {"serverId":"prod-api-1","environment":"development","release":"unknown","node":"v20.10.0"}
14:02:15 [IW] debug: [IW] Global hooks attached
14:02:15 [IW] debug: [IW] Memory monitor started
14:02:15 [IW] debug: [IW] Heartbeat manager started (5000ms interval)
14:02:15 [IW] debug: [IW] Axios global instance patched
14:02:15 [IW] debug: [IW] global fetch patched
14:02:15 [IW] debug: [IW] Express auto-registration set up — will activate on app.listen()
14:02:15 [IW] info: IncidentWatch SDK ready ✓
```

### 2. Sync Route Error (Express)

```
14:02:20 [IW] debug: [IW] Express error middleware caught: Synchronous route crash - /error-sync
14:02:20 [IW] error: [IW] Incident captured: Synchronous route crash - /error-sync {"incidentId":"abc-123","severity":"SEV2"}
14:02:20 [IW] debug: [IW] Incident sent: abc-123
```

**Platform receives:**

```json
{
  "id": "abc-123",
  "title": "[Error] Synchronous route crash - /error-sync",
  "severity": "SEV2",
  "source": "sdk-auto",
  "tags": ["express", "http-error", "status-500"],
  "breadcrumbs": [
    {
      "category": "http.request",
      "data": { "method": "GET", "url": "/error-sync" }
    }
  ],
  "context": { "method": "GET", "url": "/error-sync", "status": 500 },
  "runtime": { "node": "v20.10.0", "platform": "linux", "pid": 12345 }
}
```

### 3. Async Route Error (Uncaught Promise)

```
14:02:25 [IW] error: [IW] unhandledRejection {"error":"Asynchronous route failure","stack":"..."}
14:02:25 [IW] error: [IW] Incident captured: Asynchronous route failure {"incidentId":"def-456","severity":"SEV2"}
14:02:25 [IW] debug: [IW] Incident sent: def-456
```

### 4. Slow Operation

```
14:02:35 [IW] warn: [IW] Slow operation: heavy-database-query took 2014ms
14:02:35 [IW] debug: [IW] Incident captured: Slow: heavy-database-query (2014ms > 1000ms) {"incidentId":"ghi-789","severity":"SEV3"}
14:02:35 [IW] debug: [IW] Incident sent: ghi-789
```

### 5. Manual Incident with captureMessage

```javascript
await iw.captureMessage("Database connection pool running low", {
  severity: "SEV2",
  tags: ["database", "pool-warning"],
  context: { poolSize: 10, active: 9 },
});
```

**Terminal:**

```
14:02:40 [IW] debug: [IW] Incident captured: Database connection pool running low {"incidentId":"jkl-012","severity":"SEV2"}
14:02:40 [IW] debug: [IW] Incident sent: jkl-012
```

**Platform receives:**

```json
{
  "id": "jkl-012",
  "title": "Database connection pool running low",
  "severity": "SEV2",
  "source": "sdk-manual",
  "tags": ["database", "pool-warning", "app:test-app", "team:backend"],
  "context": {"poolSize": 10, "active": 9, "user": {"id": "test-user-1"}},
  "breadcrumbs": [...],
  "timestamp": "2026-05-01T14:02:40.000Z"
}
```

### 6. wrapAsync — Auto-catch non-Express errors

```javascript
const sendEmail = iw.wrapAsync(async (to, body) => {
  if (Math.random() > 0.5) throw new Error("SMTP failed");
  return { sent: true };
}, "sendEmail");

await sendEmail("user@test.com", { subject: "Hello" });
```

**Terminal when error occurs:**

```
14:02:45 [IW] debug: [IW] async.start.sendEmail {"argsCount":1}
14:02:45 [IW] debug: [IW] async.error.sendEmail {"error":"SMTP failed"}
14:02:45 [IW] error: [IW] Incident captured: SMTP failed {"incidentId":"mno-345","severity":"SEV2"}
14:02:45 [IW] debug: [IW] Incident sent: mno-345
```

### 7. withScope — Isolated context

```javascript
await iw.withScope(
  {
    tags: ["checkout-flow"],
    context: { cartId: "cart-456" },
    user: { id: "buyer-789", email: "buyer@test.com" },
  },
  async () => {
    await processPayment();
    await iw.captureMessage("Payment processed", { severity: "SEV3" });
  },
);
```

**Platform receives (note scoped tags and user):**

```json
{
  "title": "Payment processed",
  "severity": "SEV3",
  "tags": ["checkout-flow", "app:test-app", "team:backend"],
  "context": {
    "cartId": "cart-456",
    "user": { "id": "buyer-789", "email": "buyer@test.com" }
  }
}
```

### 8. Global Hooks — Process Crash

```
14:03:00 [IW] error: [IW] uncaughtException — process will exit {"error":"CRITICAL FAILURE","origin":"uncaughtException"}
14:03:00 [IW] error: [IW] Incident captured: CRITICAL FAILURE {"incidentId":"pqr-678","severity":"SEV1"}
14:03:00 [IW] debug: [IW] Incident sent: pqr-678
14:03:00 [IW] info: [IW] Flush complete. Shutting down.
Process exited with code 1
```

### 9. Circuit Breaker

If platform is unreachable:

```
14:03:10 [IW] warn: [IW] Failed to send incident after 3 retries {"incidentId":"stu-901","error":"ECONNREFUSED"}
14:03:10 [IW] warn: [IW] Failed to send incident after 3 retries {"incidentId":"vwx-234","error":"ECONNREFUSED"}
14:03:10 [IW] warn: [IW] Failed to send incident after 3 retries {"incidentId":"yza-567","error":"ECONNREFUSED"}
14:03:10 [IW] warn: [IW] Failed to send incident after 3 retries {"incidentId":"bcd-890","error":"ECONNREFUSED"}
14:03:10 [IW] warn: [IW] Failed to send incident after 3 retries {"incidentId":"efg-123","error":"ECONNREFUSED"}
14:03:10 [IW] error: [IW] Circuit breaker tripped — platform unreachable. Will retry in 60s
# After 60 seconds:
14:04:10 [IW] info: [IW] Circuit breaker reset — retrying platform connection
```

### 10. Status Check

```javascript
const status = iw.getStatus();
console.log(status);
```

**Output:**

```json
{
  "initialized": true,
  "version": "1.0.0",
  "integrations": {
    "express": true,
    "axios": true,
    "fetch": true,
    "console": true
  },
  "memoryMonitor": true,
  "heartbeat": true,
  "circuitBreakerOpen": false,
  "config": {
    "environment": "production",
    "serverId": "prod-api-1",
    "appName": "my-app",
    "slowThresholdMs": 5000,
    "debug": false
  }
}
```

---

## ⚠️ Important Notes

- Call `init()` **once** at your app's entry point. Duplicate calls are ignored with a warning.
- The Express integration only activates on `app.listen()`. Routes added after `listen()` are also covered.
- `console.error` integration is **off by default** — enable it with `integrations: { console: true }`.
- The SDK ignores common network errors (`ECONNRESET`, `EPIPE`, etc.) by default. Override with `ignoreErrors: []`.
- `shutdown()` is called automatically on `SIGTERM`/`SIGINT`, but you should call it manually if you have custom shutdown logic.

---

**Happy Coding!** Report issues at https://github.com/Adityakbr01/incidentWatch/tree/main/packages/sdk
