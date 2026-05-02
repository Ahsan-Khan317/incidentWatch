import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { LogEntry } from "../pages/LogsView";

interface LogTerminalProps {
  logs: LogEntry[];
  isPaused: boolean;
}

const LogTerminal: React.FC<LogTerminalProps> = ({ logs, isPaused }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (!isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  const filteredLogs = logs.filter((log) => {
    const searchStr = filter.toLowerCase();
    const messageStr = typeof log.message === "string" ? log.message : "";
    return (
      messageStr.toLowerCase().includes(searchStr) ||
      log.level.toLowerCase().includes(searchStr) ||
      (log.service && log.service.toLowerCase().includes(searchStr))
    );
  });

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] relative">
      {/* Subtle light ambient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-info/10 blur-[100px] rounded-full" />
      </div>

      {/* Terminal Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-5 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="mx-2 h-4 w-px bg-neutral-200" />
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-primary" />
            <span className="font-mono text-[0.7rem] font-bold tracking-tight text-neutral-500 uppercase">
              telemetry.stream <span className="text-neutral-300 px-1">—</span>{" "}
              <span className="text-primary">live</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white border border-neutral-200 shadow-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[0.6rem] font-bold text-neutral-400 uppercase tracking-widest">
              Live Connection
            </span>
          </div>
          <span className="font-mono text-[0.65rem] font-bold text-neutral-300">
            {filteredLogs.length} / {logs.length} EVENTS
          </span>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 font-mono text-[0.8125rem] leading-[1.6] custom-scrollbar relative z-10"
      >
        <div className="mb-6 flex gap-4 border-b border-neutral-100 pb-3 font-mono text-[0.65rem] font-black uppercase tracking-[0.2em] text-neutral-400">
          <div className="w-10">LN</div>
          <div className="w-24 text-center">TIMESTAMP</div>
          <div className="w-20 text-center">LEVEL</div>
          <div className="flex-1">MESSAGE</div>
        </div>

        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {filteredLogs.map((log) => (
              <motion.div
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                key={log.id}
                className={`group flex gap-4 py-2 px-2 rounded-lg transition-all duration-200 hover:bg-neutral-50 ${
                  log.level === "ERROR" || log.level === "CRIT"
                    ? "bg-rose-50 border border-rose-100"
                    : ""
                }`}
              >
                <div className="w-10 shrink-0 text-neutral-300 group-hover:text-neutral-500 transition-colors select-none text-[0.75rem] font-bold">
                  {log.lineNumber}
                </div>
                <div className="w-24 shrink-0 text-neutral-400 font-bold tabular-nums text-center">
                  {log.timestamp}
                </div>
                <div className="w-20 shrink-0 flex justify-center">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[0.65rem] font-black tracking-wider uppercase border ${
                      log.level === "INFO"
                        ? "bg-primary/5 text-primary border-primary/20"
                        : log.level === "WARN"
                          ? "bg-amber-400/5 text-amber-500 border-amber-400/20"
                          : "bg-rose-500/5 text-rose-500 border-rose-500/20"
                    }`}
                  >
                    {log.level}
                  </span>
                </div>
                <div
                  className={`flex-1 break-words font-medium ${
                    log.level === "CRIT"
                      ? "text-rose-700"
                      : log.level === "ERROR"
                        ? "text-rose-600"
                        : "text-neutral-700"
                  }`}
                >
                  {log.service && (
                    <span className="text-[0.65rem] font-bold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded mr-2 uppercase tracking-tighter border border-neutral-200">
                      {log.service}
                    </span>
                  )}
                  {log.message}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!isPaused && (
          <div className="mt-8 flex items-center gap-3 py-2 px-4 rounded-full bg-primary/5 border border-primary/10 w-fit shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
            <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] text-primary">
              Streaming Telemetry Data
            </span>
          </div>
        )}
      </div>

      {/* Terminal Footer */}
      <div className="flex h-14 shrink-0 items-center gap-4 border-t border-neutral-100 bg-neutral-50/30 px-5 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2 text-primary font-bold">
          <span className="text-xs">❯</span>
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter telemetry events..."
            className="w-full border-none bg-transparent font-mono text-[0.8rem] text-neutral-700 placeholder-neutral-300 outline-none focus:ring-0 font-medium"
          />
        </div>
        <div className="flex items-center gap-3">
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 font-mono text-[0.65rem] text-neutral-400 shadow-sm font-bold">
            <span className="text-[0.7rem]">⌘</span>
            <span>K</span>
          </kbd>
          <div className="h-4 w-px bg-neutral-200 mx-1" />
          <span className="text-[0.65rem] font-black text-neutral-300 uppercase tracking-tighter">
            v1.2.4-stable
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogTerminal;
