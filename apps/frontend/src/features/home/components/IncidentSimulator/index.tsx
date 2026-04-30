"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import {
  View,
  Level,
  ServerData,
  Incident,
  TeamMember,
  LogEntry,
  TimelineItem,
  Toast,
} from "./types";
import { SCENARIOS, LOG_TEMPLATES } from "./constants";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { DashboardView } from "./DashboardView";
import { IncidentsView } from "./IncidentsView";
import { LogsView } from "./LogsView";
import { StatusView } from "./StatusView";
import { SettingsView } from "./SettingsView";

export const IncidentSimulator = () => {
  // --- State ---
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [servers, setServers] = useState<ServerData[]>([
    {
      id: "prod-api",
      name: "Prod API",
      env: "production",
      cpu: 43,
      mem: 56,
      rps: 1260,
      err: 0,
      status: "up",
      exp: "api",
    },
    {
      id: "prod-db",
      name: "Database",
      env: "production",
      cpu: 28,
      mem: 69,
      rps: 910,
      err: 0,
      status: "up",
      exp: "db",
    },
  ]);
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: "AK",
      name: "Arjun Kumar",
      role: "Backend Eng",
      av: "bg-blue-500/20 text-blue-500",
      duty: true,
      exp: ["api", "app"],
    },
    {
      id: "PS",
      name: "Priya Sharma",
      role: "DB Admin",
      av: "bg-green-500/20 text-green-500",
      duty: true,
      exp: ["db", "infra"],
    },
    {
      id: "RS",
      name: "Rohit Singh",
      role: "Infra Eng",
      av: "bg-orange-500/20 text-orange-500",
      duty: true,
      exp: ["infra", "network"],
    },
  ]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cfg, setCfg] = useState({
    autoAssign: true,
    autoEscalate: true,
    escalateMin: 3,
  });
  const [clock, setClock] = useState("--:--:--");

  // --- Refs ---
  const logEndRef = useRef<HTMLDivElement>(null);

  // --- Helpers ---
  const ts = () => new Date().toLocaleTimeString("en-GB", { hour12: false });
  const uuid = () => Math.random().toString(36).substring(2, 9);

  const addToast = (msg: string, type: Toast["type"]) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  };

  const addLog = (sid: string, cls: Level, msg: string) => {
    setLogs((prev) => [
      { id: uuid(), ts: ts(), sid, cls, msg },
      ...prev.slice(0, 99),
    ]);
  };

  const addTimeline = (msg: string, color: string, detail = "") => {
    setTimeline((prev) => [
      { ts: ts(), msg, color, detail },
      ...prev.slice(0, 19),
    ]);
  };

  // --- Actions ---
  const crashServer = (sid: string) => {
    const sv = servers.find((x) => x.id === sid);
    const sc = SCENARIOS[sid] || {
      title: `Critical error on ${sid}`,
      sev: "SEV1",
      exp: "infra",
      root: "Unknown failure",
      fix: "Restarting node",
      conf: 50,
      impact: "Partial loss of service",
      logs: [["ll-err", "Fatal error"]],
    };

    if (!sv || sv.status !== "up") return;

    // Instant Feedback Logs
    addLog(
      sid,
      "ll-warn",
      `[USER] Manual failure injection triggered for ${sv.name}`,
    );
    addLog(sid, "ll-sys", `[PLATFORM] Simulating node isolation for ${sid}`);
    addTimeline(
      `Simulation: Failure Injected — ${sv.name}`,
      "bg-warning",
      "User-initiated chaos event",
    );

    setServers((prev) =>
      prev.map((s) =>
        s.id === sid
          ? { ...s, status: "crashing", cpu: 97, mem: 96, err: 2400 }
          : s,
      ),
    );

    setTimeout(() => {
      addTimeline(
        `Heartbeat lost — ${sv.name}`,
        "bg-danger",
        "Missed 3 consecutive heartbeats",
      );
      addLog(
        sid,
        "ll-err",
        "[AGENT] Heartbeat timeout — connectivity loss detected",
      );

      setServers((prev) =>
        prev.map((s) => (s.id === sid ? { ...s, status: "crashed" } : s)),
      );
      const responder = cfg.autoAssign
        ? team.find((m) => m.duty && m.exp.includes(sc.exp)) ||
          team.find((m) => m.duty) ||
          null
        : null;

      const newInc: Incident = {
        id: `INC-${1000 + incidents.length}`,
        title: sc.title,
        sev: sc.sev,
        status: "open",
        responder,
        assignMode: responder ? "auto" : "manual",
        updates: [],
        sid,
        ts: ts(),
        aiStatus: "thinking",
        escalated: false,
        acked: false,
        sc,
      };

      setIncidents((prev) => [newInc, ...prev]);
      addTimeline(`Auto-created: ${newInc.id}`, "bg-danger", sc.title);
      addLog(
        sid,
        "ll-sys",
        `[PLATFORM] Incident ${newInc.id} created — alerting on-call`,
      );

      if (responder) {
        addLog(
          sid,
          "ll-sys",
          `[PLATFORM] Auto-assigned → ${responder.name} (Expertise match)`,
        );
        addTimeline(
          `Assigned to ${responder.name}`,
          "bg-primary",
          "Primary on-call",
        );
        addToast(`${newInc.id} auto-assigned to ${responder.name}`, "info");
      }

      setTimeout(() => {
        setIncidents((prev) =>
          prev.map((i) =>
            i.id === newInc.id ? { ...i, aiStatus: "done" } : i,
          ),
        );
        addLog(
          sid,
          "ll-sys",
          `[AI-INSIGHT] Root cause correlated — confidence ${sc.conf}%`,
        );
        addToast(`AI root cause ready for ${newInc.id}`, "info");
      }, 2800);
    }, 1700);
  };

  const resolveInc = (id: string) => {
    const inc = incidents.find((i) => i.id === id);
    if (!inc) return;

    addLog(inc.sid, "ll-sys", `[USER] Marked incident ${id} as RESOLVED`);
    addLog(
      inc.sid,
      "ll-info",
      `[PLATFORM] Re-integrating ${inc.sid} into active pool`,
    );

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: "resolved", resolvedTs: ts() } : i,
      ),
    );
    setServers((prev) =>
      prev.map((s) =>
        s.id === inc.sid ? { ...s, status: "up", cpu: 30, mem: 55, err: 0 } : s,
      ),
    );

    setTimeout(() => {
      addLog(inc.sid, "ll-info", "[AGENT] Health check passed — Node nominal");
      addTimeline(`${id} resolved`, "bg-success", "System recovered");
      addToast(`${id} resolved successfully`, "success");
    }, 500);
  };

  const ackInc = (id: string) => {
    const inc = incidents.find((i) => i.id === id);
    if (!inc) return;

    addLog(inc.sid, "ll-sys", `[USER] Acknowledged incident ${id}`);
    setIncidents((prev) =>
      prev.map((i) => (i.id === id ? { ...i, acked: true } : i)),
    );
    addToast(`${id} acknowledged`, "info");
  };

  // --- Simulation Loop ---
  useEffect(() => {
    const clockInt = setInterval(() => setClock(ts()), 1000);
    const tickInt = setInterval(() => {
      setServers((prev) =>
        prev.map((s) => {
          if (s.status !== "up") return s;

          // Randomly generate a log for this server
          if (Math.random() > 0.4) {
            const temp =
              LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
            const msg = temp.msg
              .replace("{val}", Math.floor(Math.random() * 100).toString())
              .replace("{id}", Math.random().toString(36).substring(7))
              .replace("{n}", Math.floor(Math.random() * 3).toString())
              .replace("{ip}", `10.0.1.${Math.floor(Math.random() * 255)}`);
            addLog(s.id, temp.cls as Level, msg);
          }

          return {
            ...s,
            cpu: Math.max(
              20,
              Math.min(60, s.cpu + (Math.random() > 0.5 ? 2 : -2)),
            ),
            mem: Math.max(
              40,
              Math.min(72, s.mem + (Math.random() > 0.5 ? 1 : -1)),
            ),
            rps: Math.max(
              200,
              Math.min(1500, s.rps + (Math.random() > 0.5 ? 10 : -10)),
            ),
          };
        }),
      );
    }, 2400);

    return () => {
      clearInterval(clockInt);
      clearInterval(tickInt);
    };
  }, []);

  return (
    <div className="glass-surface border-border-soft bg-surface-1 rounded-2xl overflow-hidden  flex flex-col h-[520px] w-full mx-auto">
      {/* Shell Layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          view={view}
          setView={setView}
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          incidents={incidents}
          team={team}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <Topbar view={view} clock={clock} />

          {/* Dynamic Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 no-scrollbar">
            {/* Toast Stack */}
            <AnimatePresence>
              {toasts.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-4 mb-2 shadow-lg ${
                    t.type === "success"
                      ? "bg-success/10 border-success/20 text-success"
                      : t.type === "danger"
                        ? "bg-danger/10 border-danger/20 text-danger"
                        : "bg-primary/10 border-primary/20 text-primary"
                  }`}
                >
                  <span className="text-[10px] font-bold">{t.msg}</span>
                  <X
                    size={12}
                    className="cursor-pointer"
                    onClick={() =>
                      setToasts((prev) => prev.filter((x) => x.id !== t.id))
                    }
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {view === "dashboard" && (
              <DashboardView
                servers={servers}
                incidents={incidents}
                team={team}
                logs={logs}
                timeline={timeline}
                crashServer={crashServer}
              />
            )}

            {view === "incidents" && (
              <IncidentsView
                incidents={incidents}
                resolveInc={resolveInc}
                ackInc={ackInc}
              />
            )}

            {view === "logs" && <LogsView logs={logs} logEndRef={logEndRef} />}

            {view === "status" && <StatusView />}

            {view === "settings" && (
              <SettingsView
                cfg={cfg}
                setCfg={setCfg}
                team={team}
                setTeam={setTeam}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
