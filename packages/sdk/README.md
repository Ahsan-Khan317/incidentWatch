# 🧠 SDK (In-App Agent)

The **SDK (Software Development Kit)** is a lightweight library that runs inside the user’s application.
It provides **automatic error tracking, heartbeat monitoring, and basic log collection** with minimal setup.

---

## 🎯 Purpose (Why SDK?)

The SDK is designed to give **instant visibility from inside the application**:

- 🚨 Capture runtime errors automatically
- ❤️ Send heartbeat signals (is the app alive?)
- 📄 Collect important logs (without heavy config)
- ⚡ Provide real-time insights with minimal overhead

👉 It is the **fastest way to integrate monitoring** into any app.

---

## ⚙️ How It Works

Once initialized, the SDK automatically:

### 1. ❤️ Heartbeat Monitoring

Sends a signal at regular intervals:

```text
Every 30 sec → "App is alive"
```

👉 If heartbeat stops → system detects downtime 🚨

---

### 2. 🔴 Automatic Error Capture

The SDK hooks into runtime events:

- `uncaughtException`
- `unhandledRejection`
- `console.error`

👉 This ensures even unhandled crashes are captured.

---

### 3. 🟡 Lightweight Logging

- Captures important logs (errors/warnings)
- Batches logs to reduce network usage
- Sends data asynchronously (non-blocking)

---

## 🔗 Data Flow

```text
Application (SDK)
        ↓
Logs / Errors / Heartbeat
        ↓
Backend API (Ingestion)
        ↓
Redis (BullMQ)
        ↓
Workers
        ↓
Database
        ↓
Socket.io
        ↓
Frontend Dashboard (Live updates)
```

---

## 🚀 Installation

```bash
npm install your-agent
```

---

## 🧩 Basic Usage

```ts
import { init } from "your-agent";

init({
  apiKey: "YOUR_API_KEY",
  serverId: "prod-1",
});
```

👉 That’s it. No additional setup required.

---

## ⚡ Features

- ✅ Zero-config integration
- ✅ Automatic error tracking
- ✅ Heartbeat-based uptime monitoring
- ✅ Lightweight and low CPU usage
- ✅ Works across Node.js environments

---

## 💥 Crash Handling

- SDK captures errors **before crash**
- Sends last known logs (best effort)
- Heartbeat stops → backend detects downtime

> Note: After a crash, the SDK stops (since it runs inside the app).
> This is why we recommend using the **Agent CLI (sidecar)** for higher reliability.

---

## ⚠️ Limitations

- Runs inside the app → stops if app stops
- Depends on runtime (Node.js, etc.)
- Cannot capture logs if nothing is emitted

---

## 🧠 Best Practice (Recommended)

👉 For production use:

- Use **SDK** for:
  - errors
  - heartbeat
  - quick integration

- Use **Agent CLI** for:
  - file logs
  - system-level monitoring
  - crash resilience

---

## 🎯 Summary

The SDK provides **fast, easy, and low-overhead monitoring directly from inside the application**, making it ideal for quick integration and real-time error visibility.

When combined with the Agent CLI, it becomes part of a **reliable, hybrid monitoring system**.

---

# 🎤 Short Pitch Line (use anywhere)

> “Our SDK provides zero-config error tracking and heartbeat monitoring directly inside the application, enabling instant observability with minimal overhead.”

---
