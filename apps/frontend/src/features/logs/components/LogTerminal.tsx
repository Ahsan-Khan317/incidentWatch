import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogEntry } from "../pages/LogsView";

interface LogTerminalProps {
  logs: LogEntry[];
  isPaused: boolean;
}

const LogTerminal: React.FC<LogTerminalProps> = ({ logs, isPaused }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded border border-border bg-black/50 shadow-lg backdrop-blur-sm">
      {/* Terminal Header */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-surface-1 px-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-rose-500/50" />
            <div className="h-2 w-2 rounded-full bg-amber-500/50" />
            <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
          </div>
          <div className="mx-2 h-4 w-px bg-border" />
          <span className="font-mono text-[0.625rem] font-bold text-muted">
            system_watcher.log
          </span>
        </div>
        <span className="font-mono text-[0.625rem] font-bold text-muted">
          {logs.length} events in buffer
        </span>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-[0.8125rem] leading-relaxed custom-scrollbar"
      >
        <div className="mb-4 flex gap-4 border-b border-border pb-2 font-mono text-[0.625rem] font-bold uppercase tracking-widest text-muted">
          <div className="w-10">LN</div>
          <div className="w-24">TIMESTAMP</div>
          <div className="w-20">LEVEL</div>
          <div className="flex-1">MESSAGE</div>
        </div>

        <div className="space-y-0.5">
          <AnimatePresence mode="popLayout">
            {logs.map((log) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={log.id}
                className={`flex gap-4 py-0.5 transition-colors hover:bg-white/5 ${
                  log.level === "ERROR" || log.level === "CRIT"
                    ? "border-l-2 border-rose-500 bg-rose-500/5 pl-2 -ml-[2px]"
                    : ""
                }`}
              >
                <div className="w-10 shrink-0 text-white/20 select-none">
                  {log.lineNumber}
                </div>
                <div className="w-24 shrink-0 text-muted">{log.timestamp}</div>
                <div
                  className={`w-20 shrink-0 font-bold ${
                    log.level === "INFO"
                      ? "text-primary"
                      : log.level === "WARN"
                        ? "text-amber-400"
                        : "text-rose-500"
                  }`}
                >
                  [{log.level}]
                </div>
                <div
                  className={`flex-1 ${log.level === "CRIT" ? "text-heading bg-rose-500/20 px-1 rounded-sm" : "text-body"}`}
                >
                  {log.message}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!isPaused && (
          <div className="mt-6 flex items-center gap-2 text-primary animate-pulse">
            <span className="text-xs">_</span>
            <span className="text-[0.625rem] font-bold uppercase tracking-widest">
              Listening for new telemetry data
            </span>
          </div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="flex h-12 shrink-0 items-center gap-3 border-t border-border bg-surface-1 px-4">
        <span className="text-[0.625rem] font-bold text-primary">❯</span>
        <input
          type="text"
          placeholder="Search logs..."
          className="flex-1 border-none bg-transparent font-mono text-xs text-heading placeholder-muted outline-none focus:ring-0"
        />
        <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.625rem] text-muted">
          ESC to clear
        </kbd>
      </div>
    </div>
  );
};

export default LogTerminal;
