# 🚀 Smart Incident Response Platform

A scalable, real-time incident management and monitoring platform that helps teams detect, manage, and resolve production issues efficiently.

---

## 🧠 Overview

Modern applications face crashes, downtime, and silent failures that are hard to track. This platform covers the full incident lifecycle:

- Detect issues in real time
- Track incidents with a timeline
- Notify responders
- Provide a public status page
- Generate postmortems
- Suggest root causes using AI (optional)

---

## 🔥 Key Features

### 🚨 Incident Management

- Create, update, and resolve incidents
- Assign responders
- Severity levels (low, medium, high, critical)

### 🔄 Real-Time Updates

- Live updates via WebSockets
- Automatic timeline generation

### 📊 Public Status Page

- Show system status (operational / degraded / down)
- Transparent communication for users

### 🔔 Notifications

- Email / webhook alerts
- Severity-based escalation (future)

### 🧠 AI Support (Optional)

- Root cause suggestions
- Incident summaries

---

## 🧩 Architecture

```text
SDK / CLI (Agents)
        ↓
Backend API (Ingestion)
        ↓
Redis + BullMQ (Queue)
        ↓
Workers (Processing)
        ↓
Database
        ↓
Socket.io (Realtime)
        ↓
Frontend Dashboard
```

---

## 📦 Monorepo Structure (Matches Current Layout)

```text
root/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── app.js
│   │   │   ├── server.js
│   │   │   ├── _tests_/
│   │   │   ├── configs/
│   │   │   │   └── env.config.js
│   │   │   ├── constants/
│   │   │   │   └── index.js
│   │   │   ├── middlewares/
│   │   │   │   └── error.middleware.js
│   │   │   ├── module/
│   │   │   │   ├── Auth/
│   │   │   │   │   ├── auth.controller.js
│   │   │   │   │   ├── auth.dao.js
│   │   │   │   │   ├── auth.route.js
│   │   │   │   │   ├── auth.schema.js
│   │   │   │   │   └── auth.service.js
│   │   │   │   └── User/
│   │   │   ├── routes/
│   │   │   │   └── index.js
│   │   │   ├── socket/
│   │   │   │   └── socket.js
│   │   │   └── utils/
│   │   │       ├── ApiError.js
│   │   │       ├── ApiResponse.js
│   │   │       └── asyncHandler.js
│   │   ├── eslint.config.js
│   │   ├── jsconfig.json
│   │   └── tsconfig.json
│   └── frontend/
│       ├── app/
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── public/
│       ├── eslint.config.mjs
│       ├── next.config.ts
│       └── tsconfig.json
├── packages/
│   ├── sdk/
│   │   └── index.ts
│   └── cli/
│       └── index.ts
├── readme.md
├── Git_Workflow.md
└── package.json
```

---

## 🧠 Monitoring Strategy (Hybrid)

This platform uses a multi-source monitoring approach:

| Source    | Purpose                       |
| --------- | ----------------------------- |
| SDK       | Errors, heartbeat, basic logs |
| CLI Agent | File logs, system monitoring  |
| Heartbeat | Detect downtime               |

This ensures reliability even during crashes.

---

## ⚙️ Tech Stack

- **Frontend:** Next.js, Tailwind, Socket.io-client
- **Backend:** Node.js, Express, Socket.io
- **Database:** MongoDB
- **Queue:** Redis + BullMQ
- **Agents:** SDK (Node.js), CLI (Bun/Node)

---

## 🚀 Getting Started

### Prerequisites

- Bun (recommended for monorepo scripts)
- Node.js (for Next.js and tooling)
- MongoDB + Redis (for backend data and queue)

### Install dependencies

```bash
bun install
```

### Run all apps (from repo root)

```bash
bun run dev
```

This runs the workspaces in parallel using the root `dev` script.

---

## 🔧 App Scripts

### Root

```bash
bun run dev
```

### Backend (apps/backend)

```bash
bun run dev
bun run start
bun run lint
bun run lint:fix
bun run format
```

### Frontend (apps/frontend)

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## 🧩 Backend Overview (apps/backend)

- `src/server.js` is the runtime entry point.
- `src/app.js` wires middleware, routes, and error handling.
- `src/configs/env.config.js` centralizes configuration values.
- `src/routes/index.js` aggregates API routes.
- `src/socket/socket.js` hosts real-time server events.
- `src/module/` follows a modular pattern (controller, service, schema, dao).

---

## 🧩 Frontend Overview (apps/frontend)

- `app/layout.tsx` defines shared layout and metadata.
- `app/page.tsx` is the main dashboard entry.
- `public/` contains static assets.

---

## 🧠 SDK (packages/sdk)

The SDK runs in-app and reports errors and heartbeats. It is structured as a package workspace so it can be published later.

```ts
import { init } from "your-agent";

init({
  apiKey: "YOUR_API_KEY",
  serverId: "prod-1",
});
```

---

## 🧠 CLI Agent (packages/cli)

The CLI runs independently to collect logs and status, even if the app crashes.

```bash
npx your-agent start --key=API_KEY --id=SERVER_ID
```

---

## 🔗 Data Flow

```text
App / CLI
   ↓
Backend API
   ↓
Redis (BullMQ)
   ↓
Workers
   ↓
Database
   ↓
Socket.io
   ↓
Frontend (Live Logs + Incidents)
```

---

## 🎯 Future Improvements

- Multi-language SDKs (Python, Java)
- Advanced AI root cause analysis
- Alert escalation policies
- Kubernetes monitoring

---

## 🎤 Pitch Line

> “We built a hybrid incident monitoring system using an in-app SDK and a sidecar agent to ensure reliability even during application crashes.”

---

## 📜 License

MIT License
