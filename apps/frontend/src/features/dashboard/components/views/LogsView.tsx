"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LogEntry {
  id: string;
  lineNumber: number;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "CRIT";
  message: React.ReactNode;
}

const LOG_TEMPLATES = [
  {
    level: "INFO",
    message: (id: string) => (
      <>
        Incoming <span className="text-primary">GET</span> request from{" "}
        <span className="text-muted">
          192.168.1.{Math.floor(Math.random() * 255)}
        </span>{" "}
        - <span className="text-info">request_id</span>="req_{id}"
      </>
    ),
  },
  {
    level: "INFO",
    message: (id: string) => (
      <>
        <span className="text-primary">POST</span> /api/v1/auth/login{" "}
        <span className="text-info">user_id</span>="usr_{id}"{" "}
        <span className="text-success font-bold">status_code</span>="200"
      </>
    ),
  },
  {
    level: "WARN",
    message: () => (
      <>
        High latency detected on <span className="text-info">service</span>
        ="auth-gateway". Duration:{" "}
        <span className="text-warning font-bold">
          {Math.floor(Math.random() * 2000)}ms
        </span>
      </>
    ),
  },
  {
    level: "ERROR",
    message: () => (
      <>
        Database connection timeout for{" "}
        <span className="text-info">
          shard_0{Math.floor(Math.random() * 9)}
        </span>
        . Retrying in 500ms...{" "}
        <span className="text-danger font-bold">504</span>
      </>
    ),
  },
  {
    level: "CRIT",
    message: () => (
      <>
        OOM Exception in <span className="text-info">worker-pool</span>.{" "}
        <span className="text-[#ff0080] font-bold">SIGKILL</span> issued to
        process {Math.floor(Math.random() * 9000)}
      </>
    ),
  },
  {
    level: "INFO",
    message: () => (
      <>
        Garbage collection completed. Reclaimed{" "}
        <span className="text-success font-bold">
          {Math.floor(Math.random() * 100)}MB
        </span>{" "}
        in {Math.floor(Math.random() * 50)}ms.
      </>
    ),
  },
  {
    level: "INFO",
    message: () => (
      <>
        Health check passed for <span className="text-info">cluster</span>
        ="k8s-prod-cluster"
      </>
    ),
  },
  {
    level: "WARN",
    message: () => (
      <>
        Rate limit threshold approached (85%) for{" "}
        <span className="text-info">api_key</span>="sk_live_...x92"
      </>
    ),
  },
];

export const LogsView: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [nextId, setNextId] = useState(1024);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Logs
  useEffect(() => {
    const initialLogs: LogEntry[] = Array.from({ length: 15 }).map((_, i) => {
      const template =
        LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const id = Math.random().toString(36).substr(2, 6);
      return {
        id: `init-${i}`,
        lineNumber: 1000 + i,
        timestamp: new Date(Date.now() - (15 - i) * 2000).toLocaleTimeString(
          [],
          { hour12: false },
        ),
        level: template.level as any,
        message: template.message(id),
      };
    });
    setLogs(initialLogs);
    setNextId(1015);
  }, []);

  // Simulation Engine
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(
      () => {
        setLogs((prev) => {
          const template =
            LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
          const randomId = Math.random().toString(36).substr(2, 6);
          const newLog: LogEntry = {
            id: Date.now().toString(),
            lineNumber: nextId,
            timestamp: new Date().toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            level: template.level as any,
            message: template.message(randomId),
          };

          setNextId((prev) => prev + 1);
          // Keep last 100 logs
          const updated = [...prev, newLog];
          return updated.length > 100
            ? updated.slice(updated.length - 100)
            : updated;
        });
      },
      1200 + Math.random() * 1000,
    );

    return () => clearInterval(interval);
  }, [isPaused, nextId]);

  // Auto-scroll logic
  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  return (
    <motion.div
      key="logs"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col h-[calc(100vh-12rem)] bg-surface-1 rounded-md border border-border-soft overflow-hidden relative m-8"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-primary); border-radius: 2px; }
        .scanning-line {
            background: linear-gradient(to bottom, transparent 50%, rgba(var(--color-primary-rgb), 0.02) 50%);
            background-size: 100% 4px;
        }
      `,
        }}
      />

      {/* TopAppBar / Filter Bar */}
      <header className="h-16 border-b border-border-soft bg-surface-1 px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 bg-surface-2 border border-border-soft p-1 rounded-md">
            <select className="bg-transparent border-none text-xs font-bold text-muted focus:ring-0 cursor-pointer py-1 px-3 appearance-none outline-none">
              <option>Service: global-fleet</option>
              <option>Service: auth-gateway</option>
              <option>Service: db-proxy</option>
            </select>
            <div className="h-4 w-px bg-border-soft mx-1"></div>
            <select className="bg-transparent border-none text-xs font-bold text-muted focus:ring-0 cursor-pointer py-1 px-3 appearance-none outline-none">
              <option>Level: ALL</option>
              <option>Level: ERROR</option>
              <option>Level: WARN</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-3 py-1.5 border border-border-soft rounded-md text-xs font-bold transition-all ${isPaused ? "bg-warning-soft text-warning" : "bg-success-soft text-success"}`}
          >
            <div
              className={`w-2 h-2 rounded-sm ${isPaused ? "bg-warning" : "bg-success animate-pulse"}`}
            ></div>
            <span>{isPaused ? "PAUSED" : "LIVE"}</span>
          </button>
          <div className="flex items-center gap-2 text-muted">
            <button className="p-1 hover:text-heading transition-colors rounded-md">
              <span className="material-symbols-outlined text-[20px]">
                file_download
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Area: Terminal */}
      <div className="flex-1 bg-surface-0 relative overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col relative overflow-hidden">
          {/* Window Header */}
          <div className="h-10 bg-surface-1 border-b border-border-soft px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-danger opacity-50"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-warning opacity-50"></div>
                <div className="w-2.5 h-2.5 rounded-sm bg-success opacity-50"></div>
              </div>
              <div className="h-4 w-px bg-border-soft mx-2"></div>
              <span className="text-xs font-mono font-bold text-muted">
                system_watcher.log
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-muted">
              {logs.length} events in buffer
            </span>
          </div>

          {/* Log Rows */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto custom-scrollbar scanning-line font-mono text-[13px] leading-relaxed p-4 pb-20 scroll-smooth"
          >
            <div className="flex gap-4 border-b border-border-soft pb-2 mb-4 text-muted uppercase tracking-widest text-[10px] font-bold">
              <div className="w-12">LN</div>
              <div className="w-32">TIMESTAMP</div>
              <div className="w-24">LEVEL</div>
              <div className="flex-1">MESSAGE</div>
            </div>

            <div className="space-y-1">
              <AnimatePresence mode="popLayout">
                {logs.map((log) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={log.id}
                    className={`flex gap-4 group hover:bg-surface-2 transition-colors py-0.5 ${log.level === "ERROR" || log.level === "CRIT" ? "border-l-2 border-danger pl-2 -ml-[10px]" : ""}`}
                  >
                    <div className="w-12 text-zinc-600 select-none font-bold">
                      {log.lineNumber}
                    </div>
                    <div className="w-32 text-muted">{log.timestamp}</div>
                    <div
                      className={`w-24 font-bold ${
                        log.level === "INFO"
                          ? "text-info"
                          : log.level === "WARN"
                            ? "text-warning"
                            : "text-danger"
                      }`}
                    >
                      [{log.level}]
                    </div>
                    <div
                      className={`flex-1 ${log.level === "CRIT" ? "text-heading bg-[#ff0080]/10 px-1 rounded-sm" : "text-body"}`}
                    >
                      {log.message}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Listening Indicator */}
            {!isPaused && (
              <div className="mt-6 flex items-center gap-2 text-info animate-pulse">
                <span className="text-[10px]">_</span>
                <span className="text-[10px] tracking-widest font-bold uppercase">
                  Listening for new telemetry data
                </span>
              </div>
            )}
          </div>

          {/* Footer / Command Line */}
          <div className="h-12 bg-surface-1 border-t border-border-soft px-4 flex items-center gap-3 shrink-0 absolute bottom-0 left-0 w-full z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
            <span className="text-success font-bold text-xs select-none">
              ❯
            </span>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-xs font-mono text-heading placeholder-muted"
              placeholder="Search logs..."
              type="text"
            />
            <div className="flex items-center gap-2">
              <kbd className="bg-surface-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-muted border border-border-soft">
                ESC to clear
              </kbd>
            </div>
          </div>
        </div>

        {/* Dynamic Telemetry Overlay */}
        <div className="absolute bottom-16 right-8 flex flex-col gap-3 pointer-events-none z-20 hidden md:flex">
          <motion.div
            animate={{ scale: isPaused ? 0.95 : 1 }}
            className="bg-surface-0/90 backdrop-blur-md border border-border-soft p-4 rounded-md w-64 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted uppercase tracking-tighter">
                Event Velocity
              </span>
              <span
                className={`text-xs font-bold ${isPaused ? "text-muted" : "text-success"}`}
              >
                {isPaused
                  ? "0.0k/s"
                  : (1.2 + Math.random() * 0.5).toFixed(1) + "k/s"}
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-2 rounded-md overflow-hidden border border-border-soft">
              <motion.div
                animate={{ width: isPaused ? "0%" : "75%" }}
                className="h-full bg-success rounded-md"
              ></motion.div>
            </div>
          </motion.div>

          <div className="bg-surface-0/90 backdrop-blur-md border border-border-soft p-4 rounded-md w-64 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted uppercase tracking-tighter">
                Buffer Usage
              </span>
              <span className="text-info text-xs font-bold">
                {logs.length}%
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-8 rounded-sm border ${i < logs.length / 20 ? "bg-info-soft border-info-border" : "bg-surface-2 border-border-soft"}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
