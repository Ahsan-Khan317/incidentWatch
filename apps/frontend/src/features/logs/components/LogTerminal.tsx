import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { LogEntry } from "../pages/LogsView";
import Ansi from "ansi-to-react";

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
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border dark:border-white/5 bg-white dark:bg-[#050505] shadow-soft dark:shadow-2xl relative">
      {/* Subtle scanline effect for terminal feel (dark mode only) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%] z-20 hidden dark:block" />

      {/* Terminal Header */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border-soft dark:border-white/5 bg-neutral-50/50 dark:bg-white/5 px-5 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="mx-2 h-4 w-px bg-neutral-200" />
          <div className="flex items-center gap-2">
            <Terminal
              size={14}
              className="text-emerald-600 dark:text-emerald-500"
            />
            <span className="font-mono text-[0.7rem] font-bold tracking-tight text-muted dark:text-zinc-500 uppercase">
              telemetry.stream{" "}
              <span className="text-border dark:text-zinc-800 px-1">—</span>{" "}
              <span className="text-emerald-600 dark:text-emerald-500/80">
                live
              </span>
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
          <span className="font-mono text-[0.65rem] font-bold text-muted/50 dark:text-zinc-600">
            {filteredLogs.length} / {logs.length} EVENTS
          </span>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 font-mono text-[0.8125rem] leading-[1.6] custom-scrollbar relative z-10"
      >
        <div className="mb-6 flex gap-4 border-b border-border-soft dark:border-white/5 pb-3 font-mono text-[0.65rem] font-black uppercase tracking-[0.2em] text-muted/40 dark:text-zinc-600">
          <div className="w-10 text-left">LN</div>
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
                className={`group flex gap-4 py-1.5 px-2 rounded transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-white/5 ${
                  log.level === "ERROR" || log.level === "CRIT"
                    ? "bg-red-50 dark:bg-red-950/20 border-l-2 border-red-600 dark:border-red-800"
                    : ""
                }`}
              >
                <div className="w-10 shrink-0 text-muted/30 dark:text-zinc-700 group-hover:text-muted dark:group-hover:text-zinc-500 transition-colors select-none text-[0.7rem] font-bold tabular-nums">
                  {log.lineNumber}
                </div>
                <div className="w-24 shrink-0 text-muted/40 dark:text-zinc-500 font-bold tabular-nums text-center text-[0.75rem]">
                  {log.timestamp}
                </div>
                <div className="w-20 shrink-0 flex justify-center items-start pt-0.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[0.6rem] font-black tracking-wider uppercase ${
                      log.level === "INFO"
                        ? "bg-neutral-100 dark:bg-zinc-900 text-muted dark:text-zinc-400 border border-border-soft dark:border-zinc-800"
                        : log.level === "WARN"
                          ? "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-600 border border-amber-200 dark:border-amber-900/50"
                          : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-500 border border-red-200 dark:border-red-900/50"
                    }`}
                  >
                    {log.level}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  {log.service && (
                    <span className="text-[0.65rem] font-bold text-muted dark:text-zinc-500 bg-neutral-100 dark:bg-zinc-900/50 px-1.5 py-0.5 rounded mr-2 uppercase tracking-tighter border border-border-soft dark:border-white/5">
                      {log.service}
                    </span>
                  )}
                  <span
                    className={`break-words font-medium text-[0.8rem] ${
                      log.level === "CRIT"
                        ? "text-red-700 dark:text-red-500 font-bold"
                        : log.level === "ERROR"
                          ? "text-red-600 dark:text-red-400"
                          : "text-heading dark:text-zinc-300"
                    }`}
                  >
                    {typeof log.message === "string" ? (
                      <Ansi linkify={false}>{log.message}</Ansi>
                    ) : (
                      log.message
                    )}
                  </span>
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
      <div className="flex h-12 shrink-0 items-center gap-4 border-t border-border-soft dark:border-white/5 bg-neutral-50/30 dark:bg-white/5 px-5 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-2 text-primary font-bold">
          <span className="text-xs">❯</span>
        </div>
        <div className="relative flex-1">
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter telemetry events..."
            className="w-full border-none bg-transparent font-mono text-[0.75rem] text-heading dark:text-zinc-200 placeholder:text-muted/30 dark:placeholder:text-zinc-700 outline-none focus:ring-0 font-medium"
          />
        </div>
        <div className="flex items-center gap-3">
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border-soft dark:border-white/10 bg-white/50 dark:bg-white/5 px-1.5 py-0.5 font-mono text-[0.6rem] text-muted dark:text-zinc-500 shadow-sm font-bold">
            <span className="text-[0.6rem]">⌘</span>
            <span>K</span>
          </kbd>
          <div className="h-4 w-px bg-border-soft dark:bg-white/5 mx-1" />
          <span className="text-[0.6rem] font-black text-muted/30 dark:text-zinc-800 uppercase tracking-tighter">
            v1.2.4-stable
          </span>
        </div>
      </div>
    </div>
  );
};

// Custom styles to override the neon ANSI colors with classic terminal shades
const customAnsiStyles = `
  .ansi-green-fg { color: #4e9a06 !important; }
  .ansi-blue-fg { color: #3465a4 !important; }
  .ansi-yellow-fg { color: #c4a000 !important; }
  .ansi-red-fg { color: #cc0000 !important; }
  .ansi-cyan-fg { color: #06989a !important; }
  .ansi-magenta-fg { color: #75507b !important; }
  
  .dark .ansi-green-fg { color: #4e9a06 !important; }
  .dark .ansi-blue-fg { color: #729fcf !important; }
  .dark .ansi-yellow-fg { color: #c4a000 !important; }
  .dark .ansi-red-fg { color: #ef2929 !important; }
  .dark .ansi-cyan-fg { color: #34e2e2 !important; }
  .dark .ansi-magenta-fg { color: #ad7fa8 !important; }
`;

export default function LogTerminalWithStyles(props: LogTerminalProps) {
  return (
    <>
      <style>{customAnsiStyles}</style>
      <LogTerminal {...props} />
    </>
  );
}
