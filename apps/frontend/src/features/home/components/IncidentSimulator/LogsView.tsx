"use client";
import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, Download } from "lucide-react";
import { LogEntry } from "./types";

interface LogsViewProps {
  logs: LogEntry[];
  logEndRef: React.RefObject<HTMLDivElement | null>;
}

export const LogsView: React.FC<LogsViewProps> = ({ logs, logEndRef }) => {
  return (
    <div className="flex flex-col h-full bg-card rounded-none border border-white/10 overflow-hidden shadow-inner">
      <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Search logs (e.g. error, k8s, pod_id)..."
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-[11px] text-heading placeholder:text-muted focus:outline-none focus:border-primary/50 w-64 transition-all"
            />
          </div>
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          <button className="flex items-center gap-2 text-muted hover:text-heading transition-colors">
            <Filter size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Levels
            </span>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="p-2 hover:bg-white/5 rounded-lg text-muted hover:text-heading transition-all"
            title="Download Logs"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed no-scrollbar flex flex-col gap-1.5">
        {logs.map((l, i) => (
          <motion.div
            key={l.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="group flex gap-4 hover:bg-white/5 px-2 py-0.5 rounded transition-colors"
          >
            <span className="text-muted/60 select-none">{i + 1}</span>
            <span className="text-muted/40 shrink-0">[{l.ts}]</span>
            <span
              className={`font-bold shrink-0 min-w-[60px] ${
                l.cls === "ll-err"
                  ? "text-danger"
                  : l.cls === "ll-warn"
                    ? "text-warning"
                    : l.cls === "ll-info"
                      ? "text-success"
                      : l.cls === "ll-sys"
                        ? "text-primary"
                        : "text-muted"
              }`}
            >
              {l.cls.replace("ll-", "").toUpperCase()}
            </span>
            <span className="text-neutral-500 shrink-0">[{l.sid}]</span>
            <span
              className={`break-all ${
                l.msg.includes("[USER]")
                  ? "text-primary font-bold"
                  : l.msg.includes("[SYSTEM]") || l.msg.includes("[PLATFORM]")
                    ? "text-heading font-medium"
                    : "text-neutral-300"
              }`}
            >
              {l.msg}
            </span>
          </motion.div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="px-6 py-2 bg-white/5 border-t border-white/10 flex items-center justify-between shrink-0 text-[9px] font-mono text-muted uppercase">
        <div className="flex gap-4">
          <span>Buffer: {logs.length}/100</span>
          <span>Status: Streaming Live</span>
        </div>
        <div className="flex gap-4">
          <span>Encoding: UTF-8</span>
          <span>Format: JSON/Pretty</span>
        </div>
      </div>
    </div>
  );
};
