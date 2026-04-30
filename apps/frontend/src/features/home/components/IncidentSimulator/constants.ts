"use client";

export const SCENARIOS: Record<string, any> = {
  "prod-api": {
    title: "API server — OOM in search endpoint",
    sev: "SEV1",
    exp: "api",
    services: ["API Gateway", "Search"],
    logs: [
      [
        "ll-err",
        "[OOM] Java heap space in SearchController — allocation failed",
      ],
      ["ll-err", "[HTTP] 503 burst: 2800 errors/min on /api/v2/search"],
      ["ll-warn", "[GC] Full GC triggered — STW pause 4.2s"],
      ["ll-err", "[Thread] ExecutorService queue saturated 500/500"],
    ],
    root: "Memory leak in search pagination — N+1 object allocation per page not released after response. Full GC pause (4.2s) saturated thread pool.",
    fix: "Heap dump captured. SearchController paginator refactored to use streaming cursor. Pool limit raised to 1000 temporarily.",
    conf: 89,
    impact: "~42,000 search requests dropped over 6 min",
  },
  "prod-db": {
    title: "Database — connection pool exhausted",
    sev: "SEV1",
    exp: "db",
    services: ["Database", "Orders API"],
    logs: [
      ["ll-err", "[DB] Connection pool exhausted — 100/100 active"],
      ["ll-err", "[DB] Query timeout: SELECT on orders (>30s) — killed"],
      ["ll-warn", "[DB] Replication lag replica-2: 8400ms"],
    ],
    root: "Missing index on orders.created_at causing full-table scans under peak load. Scans held connections >30s, exhausting pool.",
    fix: "Added composite index (created_at, status). Pool raised to 200. Query timeout capped at 10s.",
    conf: 94,
    impact: "Checkout down ~8 min, ~₹2.1L transactions queued",
  },
};

export const LOG_TEMPLATES = [
  { cls: "ll-debug", msg: "[Agent] Heartbeat OK · seq={id} · latency={val}ms" },
  {
    cls: "ll-info",
    msg: "[K8s] Pod {id} rescheduled to node-0{n}-cluster · status=Running",
  },
  {
    cls: "ll-info",
    msg: "[Auth] Token validated · user={id} · provider=JWT-v2",
  },
  {
    cls: "ll-debug",
    msg: "[DB] Query OK · SELECT * FROM orders WHERE id={val} · exec={val}ms",
  },
  {
    cls: "ll-info",
    msg: "[Cache] Warm-up complete · bucket: static_v{n} · hit_rate={val}%",
  },
  {
    cls: "ll-sys",
    msg: "[Ingress] Auto-scaling event triggered · min_nodes=4 · load_avg=0.82",
  },
  {
    cls: "ll-debug",
    msg: "[GC] Heap pressure nominal · reclaimed {val}MB · duration=14ms",
  },
  {
    cls: "ll-info",
    msg: "[Network] Traffic routed to edge-us-east-0{n} · {ip}",
  },
  {
    cls: "ll-sys",
    msg: "[Policy] Escalation rule active · policy_id=sev1-critical-oncall",
  },
  {
    cls: "ll-info",
    msg: "[Security] TLS handshake successful · cipher=AES-256-GCM · {ip}",
  },
];

export const UPD_MSGS = [
  "Investigating — checking recent deploys",
  "Root cause confirmed — applying hotfix",
  "Hotfix deployed to staging",
  "Rolling out to production",
];
