"use client";
import React from "react";
import { Terminal } from "lucide-react";
import {
  ServerData,
  Incident,
  TeamMember,
  LogEntry,
  TimelineItem,
} from "./types";

interface DashboardViewProps {
  servers: ServerData[];
  incidents: Incident[];
  team: TeamMember[];
  logs: LogEntry[];
  timeline: TimelineItem[];
  crashServer: (sid: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  servers,
  incidents,
  team,
  logs,
  timeline,
  crashServer,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 2xl:grid-cols-4 gap-3 md:gap-4">
        {[
          {
            label: "Active",
            val: incidents.filter((i) => i.status === "open").length,
            sub: "Currently",
            color: "text-danger",
          },
          {
            label: "SEV1",
            val: incidents.filter((i) => i.sev === "SEV1").length,
            sub: "Critical",
            color: "text-warning",
          },
          {
            label: "Uptime",
            val: "99%",
            sub: "Last 24h",
            color: "text-success",
          },
          {
            label: "On-Call",
            val: team.filter((m) => m.duty).length,
            sub: "Engineers",
            color: "text-primary",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="p-3 md:p-4 bg-accent/5 border border-border-soft rounded-none"
          >
            <p className="text-[8px] md:text-[9px] font-bold text-body uppercase tracking-widest mb-1">
              {s.label}
            </p>
            <p
              className={`text-lg md:text-xl font-display font-bold ${s.color}`}
            >
              {s.val}
            </p>
            <p className="text-[8px] text-muted mt-1 uppercase tracking-tighter hidden 2xl:block">
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
          Infrastructure
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-4">
          {servers.map((s) => (
            <div
              key={s.id}
              className="p-4 bg-surface-2/25 border border-border-soft rounded-sm group transition-all"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] md:text-xs font-bold text-heading truncate">
                  {s.name}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${s.status === "up" ? "bg-success" : "bg-danger animate-pulse"}`}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="text-[8px] text-muted uppercase font-bold">
                    CPU
                  </p>
                  <p className="text-[10px] font-mono font-bold text-heading">
                    {s.cpu.toFixed(0)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] text-muted uppercase font-bold">
                    RAM
                  </p>
                  <p className="text-[10px] font-mono font-bold text-heading">
                    {s.mem.toFixed(0)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] text-muted uppercase font-bold">
                    ERR
                  </p>
                  <p className="text-[10px] font-mono font-bold text-danger">
                    {s.err}
                  </p>
                </div>
              </div>
              <button
                onClick={() => crashServer(s.id)}
                disabled={s.status !== "up"}
                className="w-full py-2 bg-surface-1 border border-border-soft rounded-sm text-[9px] md:text-[10px] font-bold text-muted hover:text-danger hover:border-danger/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Simulate Failure
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Logs & Timeline Preview - Stacked Full Width */}
      <div className="space-y-6">
        <div className="bg-[#000] border border-white/5 rounded-sm overflow-hidden flex flex-col h-48 md:h-56">
          <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex justify-between items-center shrink-0">
            <span className="text-[8px] md:text-[9px] font-bold text-muted uppercase tracking-widest">
              Live Log Feed
            </span>
            <Terminal size={12} className="text-muted" />
          </div>
          <div className="flex-1 overflow-y-auto p-3 md:p-4 font-mono text-[9px] space-y-1 no-scrollbar">
            {logs.map((l) => (
              <div
                key={l.id}
                className="flex gap-3 leading-relaxed border-b border-white/5 pb-0.5 group"
              >
                <span className="text-muted shrink-0 opacity-40">[{l.ts}]</span>
                <span
                  className={`shrink-0 font-bold ${
                    l.cls === "ll-err"
                      ? "text-danger"
                      : l.cls === "ll-warn"
                        ? "text-warning"
                        : l.cls === "ll-sys"
                          ? "text-primary"
                          : "text-success"
                  }`}
                >
                  [{l.sid.toUpperCase()}]
                </span>
                <span
                  className={`truncate ${
                    l.msg.includes("[USER]")
                      ? "text-primary font-bold"
                      : l.msg.includes("[SYSTEM]") ||
                          l.msg.includes("[PLATFORM]")
                        ? "text-heading font-medium"
                        : "text-neutral-400"
                  }`}
                >
                  {l.msg}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 bg-surface-2 border border-border-soft rounded-sm min-h-[160px] max-h-[240px] overflow-y-auto no-scrollbar">
          <p className="text-[8px] md:text-[9px] font-bold text-muted uppercase tracking-widest mb-4">
            System Timeline
          </p>
          <div className="space-y-4">
            {timeline.map((t, i) => (
              <div
                key={i}
                className="flex gap-4 relative pb-4 border-l border-border-soft/30 ml-1.5 pl-5"
              >
                <div
                  className={`absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full ${t.color} shadow-sm`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] md:text-[11px] font-bold text-heading">
                      {t.msg}
                    </p>
                    <p className="text-[8px] text-muted font-mono">{t.ts}</p>
                  </div>
                  <p className="text-[9px] text-muted leading-relaxed">
                    {t.detail}
                  </p>
                </div>
              </div>
            ))}
            {timeline.length === 0 && (
              <div className="py-10 text-center text-[10px] text-muted uppercase tracking-widest opacity-30">
                No timeline events
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
