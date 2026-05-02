# 🚨 Smart Incident Response Platform — Backend

> Production-grade incident management system with AI-powered root cause analysis, real-time alerting, BullMQ async job processing, and agent-based server monitoring.

> This documentation was generated with AI assistance. Please review carefully and update as needed.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Modules](#api-modules)
  - [1. Auth](#1-auth)
  - [2. Organization](#2-organization)
  - [3. Status Page](#3-status-page)
  - [4. Incident Management](#4-incident-management)
  - [5. Postmortem](#5-postmortem)
  - [6. Alert Rules](#6-alert-rules)
  - [7. Agent / Heartbeat Monitor](#7-agent--heartbeat-monitor)
- [BullMQ Job Queues](#bullmq-job-queues)
- [AI Integration](#ai-integration)
- [Extra Features](#extra-features)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Database Schema (Overview)](#database-schema-overview)

---

## Overview

This platform helps engineering teams manage production incidents end-to-end:

- **Detect** server crashes automatically via lightweight agents (heartbeat + log shipping)
- **Create** incidents manually or automatically when an anomaly is detected
- **Assign** responders (auto or manual) with smart escalation timers
- **Notify** via email/Slack using BullMQ async queues
- **Analyze** root cause using Claude AI from live logs
- **Resolve** and auto-generate AI postmortems in multiple formats
- **Display** a public-facing live status page for end users
- **Reward** responders with badges and achievement tracking

---

## Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                        CLIENT SERVERS                              │
│  Lightweight Agent (npm pkg)                                       │
│    ├── Heartbeat ping every 30s  ──────────────────────────────►  │
│    └── Log Shipper (tail -f app.log)  ─────────────────────────►  │
└────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│                     YOUR BACKEND (Node.js)                         │
│                                                                    │
│  REST API (Express / Fastify)                                      │
│    ├── /auth          → JWT Auth, Org + User management            │
│    ├── /org           → Members, API Keys                          │
│    ├── /status        → Status API CRUD + realtime SSE/WS          │
│    ├── /incidents     → Full Incident lifecycle                    │
│    ├── /postmortem    → AI-generated postmortem docs               │
│    ├── /alerts        → Alert rule thresholds                      │
│    └── /agent         → Heartbeat + Log ingestion endpoints        │
│                                                                    │
│  BullMQ Workers (Redis-backed)                                     │
│    ├── emailQueue        → Send email notifications                │
│    ├── slackQueue        → Post Slack messages                     │
│    ├── aiQueue           → Claude root cause analysis              │
│    ├── escalationQueue   → Auto-reassign if no response            │
│    ├── heartbeatQueue    → Monitor agent timeouts                  │
│    └── postmortemQueue   → Generate AI postmortem                  │
│                                                                    │
│  Redis                                                             │
│    ├── BullMQ queue store                                          │
│    └── Incident status cache + real-time pub/sub                   │
│                                                                    │
│  PostgreSQL                                                        │
│    └── All persistent data (users, orgs, incidents, timelines)     │
│                                                                    │
│  Claude API (Anthropic)                                            │
│    ├── Root cause analysis from crash logs                         │
│    ├── Incident debug messages                                     │
│    └── AI-generated postmortems                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer         | Technology                                 |
| ------------- | ------------------------------------------ |
| Runtime       | Node.js 20+                                |
| Framework     | Express.js / Fastify                       |
| Database      | PostgreSQL (via Prisma ORM)                |
| Queue / Cache | Redis + BullMQ                             |
| Real-time     | Socket.io or Server-Sent Events (SSE)      |
| AI            | Anthropic Claude API (`claude-sonnet-4-*`) |
| Auth          | JWT + bcrypt                               |
| Email         | Nodemailer / Resend                        |
| Validation    | Zod                                        |
| Logging       | Winston / Pino                             |
| Deploy        | Railway / Render / AWS                     |

---

## Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.schema.ts
│   │   ├── org/
│   │   │   ├── org.routes.ts
│   │   │   ├── org.controller.ts
│   │   │   ├── org.service.ts
│   │   │   └── org.schema.ts
│   │   ├── status/
│   │   ├── incident/
│   │   ├── postmortem/
│   │   ├── alerts/
│   │   └── agent/
│   ├── workers/
│   │   ├── email.worker.ts
│   │   ├── slack.worker.ts
│   │   ├── ai.worker.ts
│   │   ├── escalation.worker.ts
│   │   ├── heartbeat.worker.ts
│   │   └── postmortem.worker.ts
│   ├── queues/
│   │   └── index.ts              ← All BullMQ queue definitions
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── apiKey.middleware.ts
│   │   └── error.middleware.ts
│   ├── lib/
│   │   ├── redis.ts
│   │   ├── prisma.ts
│   │   ├── claude.ts             ← Anthropic SDK wrapper
│   │   └── socket.ts
│   └── app.ts
├── prisma/
│   └── schema.prisma
├── agent/                        ← Standalone npm package for user servers
│   ├── index.js
│   ├── heartbeat.js
│   └── logShipper.js
├── .env.example
├── package.json
└── README.md
```

---

## API Modules

### 1. Auth

Handles both **Organization-level** and **User-level** authentication.

#### Endpoints

| Method | Route                     | Description                            |
| ------ | ------------------------- | -------------------------------------- |
| `POST` | `/api/auth/org/register`  | Register a new organization            |
| `POST` | `/api/auth/org/login`     | Org admin login                        |
| `POST` | `/api/auth/user/register` | Register a new user (via invite token) |
| `POST` | `/api/auth/user/login`    | User login                             |
| `POST` | `/api/auth/refresh`       | Refresh JWT access token               |
| `POST` | `/api/auth/logout`        | Invalidate refresh token               |

#### Notes

- Org registration creates an `ADMIN` role user automatically
- User registration requires a valid invite token (sent via email from org admin)
- JWT access token: `15min` expiry — Refresh token: `7 days`
- Tokens stored in HTTP-only cookies

---

### 2. Organization

Manage organization members and API keys for agent authentication.

#### Endpoints

| Method   | Route                     | Description             | Auth  |
| -------- | ------------------------- | ----------------------- | ----- |
| `GET`    | `/api/org/members`        | List all members        | Admin |
| `POST`   | `/api/org/members/invite` | Invite member via email | Admin |
| `PATCH`  | `/api/org/members/:id`    | Update member role      | Admin |
| `DELETE` | `/api/org/members/:id`    | Remove member           | Admin |
| `GET`    | `/api/org/api-keys`       | List API keys           | Admin |
| `POST`   | `/api/org/api-keys`       | Generate new API key    | Admin |
| `DELETE` | `/api/org/api-keys/:id`   | Revoke API key          | Admin |

#### Member Invite Flow

```
Admin enters email
       ↓
System checks if user exists
       ├── YES → Send invite link with org join token
       └── NO  → Send invite link with register + join token
                       ↓
              User clicks link → registers → auto-joins org
```

#### Member Roles

| Role        | Permissions                                                      |
| ----------- | ---------------------------------------------------------------- |
| `ADMIN`     | Full access — configure alerts, assign incidents, manage members |
| `RESPONDER` | Can update, resolve incidents assigned to them                   |
| `VIEWER`    | Read-only access to incidents and status page                    |

---

### 3. Status Page

Public-facing real-time status page. No auth required for public read.

#### Endpoints

| Method   | Route                   | Description                        | Auth   |
| -------- | ----------------------- | ---------------------------------- | ------ |
| `GET`    | `/api/status`           | Get all services + current status  | Public |
| `POST`   | `/api/status`           | Create a new service               | Admin  |
| `PATCH`  | `/api/status/:id`       | Update service status manually     | Admin  |
| `DELETE` | `/api/status/:id`       | Remove service from status page    | Admin  |
| `GET`    | `/api/status/history`   | Get 90-day uptime history          | Public |
| `GET`    | `/api/status/subscribe` | SSE stream for live status updates | Public |

#### Service Status Values

```
OPERATIONAL  → All good (green)
DEGRADED     → Partial issues (yellow)
OUTAGE       → Full down (red)
MAINTENANCE  → Planned downtime (blue)
```

#### Real-time

Status changes are pushed to connected clients via **Server-Sent Events (SSE)**. When an incident is created, the related service status auto-updates to `OUTAGE`.

---

### 4. Incident Management

Core module. Handles the complete incident lifecycle.

#### Endpoints

| Method   | Route                           | Description                        | Auth              |
| -------- | ------------------------------- | ---------------------------------- | ----------------- |
| `GET`    | `/api/incidents`                | List active + history incidents    | Member            |
| `POST`   | `/api/incidents`                | Create incident (manual)           | Member            |
| `GET`    | `/api/incidents/:id`            | Get incident detail + timeline     | Member            |
| `PATCH`  | `/api/incidents/:id`            | Update incident (status, severity) | Responder / Admin |
| `DELETE` | `/api/incidents/:id`            | Archive incident                   | Admin             |
| `POST`   | `/api/incidents/:id/assign`     | Assign responder(s)                | Admin             |
| `POST`   | `/api/incidents/:id/message`    | Post update to timeline            | Responder         |
| `POST`   | `/api/incidents/:id/resolve`    | Mark as resolved                   | Responder         |
| `GET`    | `/api/incidents/:id/timeline`   | Get full incident timeline         | Member            |
| `GET`    | `/api/incidents/:id/root-cause` | Get AI root cause analysis         | Member            |

#### Incident Severity Levels

| Level  | Description                         | Auto-escalation timer |
| ------ | ----------------------------------- | --------------------- |
| `SEV1` | Complete outage — payment/auth down | 10 minutes            |
| `SEV2` | Major feature broken                | 20 minutes            |
| `SEV3` | Minor degradation                   | 60 minutes            |
| `SEV4` | Cosmetic / low impact               | No timer              |

#### Incident Lifecycle

```
DETECTED (auto from agent)
    │   or
CREATED (manual by team)
       ↓
   OPEN → assign responder (auto or manual by admin)
       ↓
   Notification sent to:
     - Assigned responder (email + in-app)
     - Admin (always notified)
     - Custom email list (configured by admin per incident type)
       ↓
   INVESTIGATING
     - Responder posts updates to timeline
     - AI suggests root cause from logs
     - Escalation timer running (if responder silent → auto reassign)
       ↓
   RESOLVED (by responder or admin)
     - Status page updated
     - Postmortem generation triggered
     - Responder gets achievement points
```

#### Auto Assignment Logic

```javascript
// Pseudo-code
const oncallUser = await getOncallResponder(orgId, incidentType);
if (oncallUser) {
  await assignIncident(incidentId, oncallUser.id);
  await escalationQueue.add("check-response", { incidentId }, { delay: SEV_TIMER[severity] });
} else {
  await notifyAdmin({ incidentId, reason: "No oncall responder configured" });
}
```

#### Escalation Queue Logic (BullMQ)

When escalation job fires after the timer delay:

```javascript
// escalation.worker.ts
processor: async (job) => {
  const { incidentId } = job.data;
  const incident = await db.incident.findUnique({ where: { id: incidentId } });

  if (incident.status === "RESOLVED") return; // already handled

  const lastUpdate = incident.updatedAt;
  const silent = Date.now() - lastUpdate > SILENCE_THRESHOLD;

  if (silent) {
    const nextResponder = await getNextOncall(incident.orgId);
    await reassignIncident(incidentId, nextResponder.id);
    await emailQueue.add("notify-reassign", { incidentId, newResponder: nextResponder });
  }
};
```

#### AI Incident Message

Responders can ask AI for debugging help mid-incident:

```
POST /api/incidents/:id/ai-message
Body: { "question": "How do I fix DB connection pool exhaustion?" }

Response: { "message": "Run: SELECT * FROM pg_stat_activity WHERE state='idle'..." }
```

---

### 5. Postmortem

Auto-generated after incident resolution using AI. Supports multiple export formats.

#### Endpoints

| Method  | Route                                           | Description                 | Auth   |
| ------- | ----------------------------------------------- | --------------------------- | ------ |
| `GET`   | `/api/postmortem/:incidentId`                   | Get postmortem for incident | Member |
| `POST`  | `/api/postmortem/:incidentId/generate`          | Trigger AI generation       | Admin  |
| `PATCH` | `/api/postmortem/:incidentId`                   | Edit postmortem content     | Admin  |
| `GET`   | `/api/postmortem/:incidentId/export?format=pdf` | Export postmortem           | Member |

#### Export Formats

- `json` — Raw structured data
- `markdown` — For GitHub/Notion
- `pdf` — For stakeholders
- `html` — For internal wiki

#### AI Postmortem Template

Claude generates the postmortem using the complete incident timeline:

```
## Incident Postmortem — {INC-ID}

**Date:** {date}
**Duration:** {duration}
**Severity:** {SEV}
**Status:** RESOLVED

---

### What Happened
{AI summary of incident from timeline}

### Root Cause
{AI root cause from logs}

### Impact
{Affected services, user impact, downtime}

### Timeline
{Chronological list of all timeline updates}

### How We Fixed It
{Resolution steps taken}

### Prevention — Action Items
{AI-suggested prevention steps with owners}
```

---

### 6. Alert Rules

Pre-define thresholds. When agent reports a metric crossing a threshold, an incident auto-creates.

#### Endpoints

| Method   | Route                   | Description          | Auth  |
| -------- | ----------------------- | -------------------- | ----- |
| `GET`    | `/api/alerts/rules`     | List all alert rules | Admin |
| `POST`   | `/api/alerts/rules`     | Create alert rule    | Admin |
| `PATCH`  | `/api/alerts/rules/:id` | Update rule          | Admin |
| `DELETE` | `/api/alerts/rules/:id` | Delete rule          | Admin |

#### Alert Rule Schema

```json
{
  "name": "High CPU Alert",
  "metric": "cpu_usage",
  "member": "gt",
  "threshold": 85,
  "duration": 60,
  "severity": "SEV2",
  "autoCreateIncident": true,
  "notifyEmails": ["admin@company.com", "oncall@company.com"]
}
```

#### Supported Metrics

| Metric              | Description              |
| ------------------- | ------------------------ |
| `cpu_usage`         | CPU percentage           |
| `memory_usage`      | RAM percentage           |
| `response_time`     | API latency in ms        |
| `error_rate`        | % of 5xx responses       |
| `heartbeat_timeout` | Agent stopped responding |
| `disk_usage`        | Disk space percentage    |

---

### 7. Agent / Heartbeat Monitor

The lightweight agent runs on user servers. No frontend needed — just `npm install`.

#### Endpoints (called by agent)

| Method | Route                  | Description                       | Auth    |
| ------ | ---------------------- | --------------------------------- | ------- |
| `POST` | `/api/agent/heartbeat` | Agent ping with metrics           | API Key |
| `POST` | `/api/agent/logs`      | Ship log lines to platform        | API Key |
| `GET`  | `/api/agent/rules`     | Agent fetches current alert rules | API Key |

#### Heartbeat Payload

```json
{
  "serverId": "prod-server-01",
  "timestamp": 1714200000000,
  "metrics": {
    "cpu": 45,
    "memory": 67,
    "disk": 55,
    "responseTime": 120
  },
  "status": "alive"
}
```

#### Heartbeat Timeout Detection (BullMQ)

```javascript
// Every heartbeat received → reset delayed job
await heartbeatQueue.add(
  `timeout-${serverId}`,
  { serverId, orgId },
  {
    jobId: `hb-${serverId}`, // same jobId = replaces previous
    delay: 90_000, // 90 seconds timeout
    removeOnComplete: true,
  },
);

// Worker fires only if no new heartbeat received in 90s
processor: async (job) => {
  await autoCreateIncident({
    title: `Server ${job.data.serverId} is not responding`,
    severity: "SEV1",
    type: "heartbeat_timeout",
  });
};
```

#### Log Shipping + Anomaly Detection

```javascript
// agent/logShipper.js  (runs on user's server)
const { execSync } = require("child_process");
const tail = require("tail");
const axios = require("axios");

const watcher = new tail.Tail("/var/log/app.log");
watcher.on("line", async (line) => {
  if (/ERROR|FATAL|CRITICAL/.test(line)) {
    await axios.post(
      `${PLATFORM_URL}/api/agent/logs`,
      {
        line,
        timestamp: Date.now(),
        serverId: process.env.SERVER_ID,
      },
      { headers: { "x-api-key": process.env.API_KEY } },
    );
  }
});
```

#### Agent Install (User's Server)

```bash
npm install -g @yourplatform/agent

# Configure
yourplatform-agent init --api-key=YOUR_KEY --server-id=prod-01

# Start (runs heartbeat + log shipper)
yourplatform-agent start
```

---

## BullMQ Job Queues

All queues use Redis as the backing store.

```typescript
// src/queues/index.ts
import { Queue } from "bullmq";
import { redis } from "../lib/redis";

const connection = redis;

export const emailQueue = new Queue("email", { connection });
export const slackQueue = new Queue("slack", { connection });
export const aiQueue = new Queue("ai", { connection });
export const escalationQueue = new Queue("escalation", { connection });
export const heartbeatQueue = new Queue("heartbeat", { connection });
export const postmortemQueue = new Queue("postmortem", { connection });
```

#### Queue Summary

| Queue             | Trigger                              | Worker Action                             |
| ----------------- | ------------------------------------ | ----------------------------------------- |
| `emailQueue`      | Incident created, assigned, resolved | Send email via Nodemailer/Resend          |
| `slackQueue`      | Same triggers                        | Post to configured Slack webhook          |
| `aiQueue`         | Incident created / logs received     | Call Claude API, save root cause          |
| `escalationQueue` | Incident assigned                    | Check after SEV timer, reassign if silent |
| `heartbeatQueue`  | Each heartbeat received              | Reset 90s timeout; fire = auto-incident   |
| `postmortemQueue` | Incident resolved                    | Generate AI postmortem, save to DB        |

---

## AI Integration

All AI calls go through a single wrapper to manage retries, token limits, and prompt versioning.

```typescript
// src/lib/claude.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function analyzeRootCause(logs: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are an SRE expert. Analyze these production logs and respond ONLY in this exact format:

ROOT CAUSE: <one line>
TRIGGER: <what caused it>
IMPACT: <what was affected>
IMMEDIATE FIX: <command or action>
PREVENTION: <long-term fix>

Logs:
${logs}`,
      },
    ],
  });
  return (message.content[0] as any).text;
}

export async function generatePostmortem(incident: IncidentData): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Generate a professional incident postmortem document for:
Incident: ${incident.title}
Duration: ${incident.duration}
Severity: ${incident.severity}
Timeline: ${JSON.stringify(incident.timeline)}
Root Cause: ${incident.rootCause}

Format as a complete postmortem with: Summary, Root Cause, Impact, Timeline, Resolution, Action Items.`,
      },
    ],
  });
  return (message.content[0] as any).text;
}

export async function getIncidentDebugHelp(question: string, context: string): Promise<string> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are helping an SRE debug a live production incident.
Context: ${context}
Question: ${question}
Give a concise, actionable answer.`,
      },
    ],
  });
  return (message.content[0] as any).text;
}
```

---

## Extra Features

### Achievement & Badge System

Responders earn points and badges when they resolve incidents. Motivates faster response.

#### How It Works

```
Incident resolved by Responder
          ↓
System calculates points:
  - Base points by severity: SEV1=100, SEV2=50, SEV3=25, SEV4=10
  - Speed bonus: resolved before escalation timer → +50%
  - First response bonus: first to respond → +20 pts
          ↓
Points added to responder's profile
          ↓
Check badge thresholds → award new badges
          ↓
Notify responder: "You earned the 'First Responder' badge! 🏅"
```

#### Badge Definitions

| Badge                | Condition                                     |
| -------------------- | --------------------------------------------- |
| 🚀 First Responder   | First incident resolved                       |
| 🔥 Fire Fighter      | 5 SEV1 incidents resolved                     |
| ⚡ Speed Demon       | Resolved 10 incidents before escalation timer |
| 🧠 Root Cause Expert | Confirmed AI root cause 20 times              |
| 💯 Century           | 100 total incidents resolved                  |
| 🏆 Top Responder     | #1 resolver in org (monthly)                  |

#### Endpoints

| Method | Route                           | Description               | Auth   |
| ------ | ------------------------------- | ------------------------- | ------ |
| `GET`  | `/api/achievements/:userId`     | Get user's badges + stats | Member |
| `GET`  | `/api/achievements/leaderboard` | Org-wide leaderboard      | Member |

---

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/incident_platform

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Anthropic AI
ANTHROPIC_API_KEY=sk-ant-...

# Email (Resend / Nodemailer)
RESEND_API_KEY=re_...
FROM_EMAIL=alerts@yourplatform.com

# Slack (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/...

# Agent
AGENT_HEARTBEAT_TIMEOUT_MS=90000
```

---

## Getting Started

```bash
# 1. Clone and install
git clone https://github.com/your-org/incident-platform-backend
cd incident-platform-backend
npm install

# 2. Setup environment
cp .env.example .env
# Fill in your values in .env

# 3. Start Redis (Docker)
docker run -d -p 6379:6379 redis:alpine

# 4. Run database migrations
npx prisma migrate dev

# 5. Start development server
npm run dev

# 6. Start BullMQ workers (separate terminal)
npm run workers
```

---

## Database Schema (Overview)

```prisma
model Organization {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  apiKeys   ApiKey[]
  members   Member[]
  incidents Incident[]
  alertRules AlertRule[]
  services  Service[]
  createdAt DateTime @default(now())
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String
  memberships  Member[]
  assignedIncidents Incident[] @relation("AssignedTo")
  achievements Achievement[]
  createdAt    DateTime  @default(now())
}

model Member {
  id     String @id @default(cuid())
  org    Organization @relation(fields: [orgId], references: [id])
  orgId  String
  user   User   @relation(fields: [userId], references: [id])
  userId String
  role   Role   @default(RESPONDER)   // ADMIN | RESPONDER | VIEWER
  @@unique([orgId, userId])
}

model Incident {
  id          String    @id @default(cuid())
  org         Organization @relation(fields: [orgId], references: [id])
  orgId       String
  title       String
  severity    Severity  // SEV1 | SEV2 | SEV3 | SEV4
  status      IncidentStatus // OPEN | INVESTIGATING | RESOLVED
  assignedTo  User?     @relation("AssignedTo", fields: [assignedToId], references: [id])
  assignedToId String?
  autoDetected Boolean  @default(false)
  logs        String?   // Raw logs from agent
  rootCause   String?   // AI analysis result
  timeline    TimelineEntry[]
  postmortem  Postmortem?
  createdAt   DateTime  @default(now())
  resolvedAt  DateTime?
}

model TimelineEntry {
  id         String   @id @default(cuid())
  incident   Incident @relation(fields: [incidentId], references: [id])
  incidentId String
  message    String
  author     String
  type       String   // UPDATE | AI_ANALYSIS | ASSIGNMENT | RESOLUTION
  createdAt  DateTime @default(now())
}

model Service {
  id     String         @id @default(cuid())
  org    Organization   @relation(fields: [orgId], references: [id])
  orgId  String
  name   String
  status ServiceStatus  // OPERATIONAL | DEGRADED | OUTAGE | MAINTENANCE
  uptimeHistory UptimeRecord[]
}

model AlertRule {
  id          String  @id @default(cuid())
  org         Organization @relation(fields: [orgId], references: [id])
  orgId       String
  name        String
  metric      String
  member    String  // gt | lt | eq
  threshold   Float
  duration    Int     // seconds threshold must be exceeded
  severity    Severity
  autoCreate  Boolean @default(true)
  notifyEmails String[]
}

model Achievement {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  badge     String
  points    Int
  earnedAt  DateTime @default(now())
}
```

---

## MVP Checklist

| Feature                              | Priority    | Status |
| ------------------------------------ | ----------- | ------ |
| Agent heartbeat + timeout detection  | ✅ Must     | —      |
| Log shipper → error detection        | ✅ Must     | —      |
| BullMQ async job queues              | ✅ Must     | —      |
| AI root cause from logs (Claude API) | 🔥 Standout | —      |
| Auto incident on crash               | ✅ Must     | —      |
| Public status page (live SSE)        | ✅ Must     | —      |
| Org + Member management              | ✅ Must     | —      |
| Incident CRUD + Timeline             | ✅ Must     | —      |
| Email notifications                  | ✅ Must     | —      |
| AI Postmortem generation             | 🔥 Standout | —      |
| Alert rule thresholds                | ✅ Must     | —      |
| Achievement + Badge system           | ⭐ Extra    | —      |
| Escalation auto-reassignment         | 🔥 Standout | —      |

---

> Built for Sheriyans Hackathon · Team of 4 · Problem Statement #5 — Smart Incident Response Platform

> This documentation was generated with AI assistance. Please review carefully and update as needed.
