import Ansi from "ansi-to-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Info,
  MousePointer2,
  Search,
  Terminal,
  Zap,
} from "lucide-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { LogEntry } from "../pages/LogsView";

interface LogTerminalProps {
  logs: LogEntry[];
  isPaused: boolean;
  droppedCount?: number;
}

/**
 * LogRow - Memoized to prevent re-renders of the entire list when new logs arrive.
 * Only the specific row that changes (or new rows) will be rendered.
 */
const LogRow: React.FC<{ log: LogEntry; filter: string }> = React.memo(
  ({ log, filter }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const [jsonCopied, setJsonCopied] = useState(false);

    const copyToClipboard = useCallback(
      (text: string, type: "msg" | "json") => {
        navigator.clipboard.writeText(text);
        if (type === "msg") {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          setJsonCopied(true);
          setTimeout(() => setJsonCopied(false), 2000);
        }
      },
      [],
    );

    const highlightText = (text: string, highlight: string) => {
      if (!highlight.trim()) return text;
      const parts = String(text).split(new RegExp(`(${highlight})`, "gi"));
      return (
        <>
          {parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
              <mark
                key={i}
                className="bg-primary/20 text-primary font-bold rounded-sm px-0.5"
              >
                {part}
              </mark>
            ) : (
              part
            ),
          )}
        </>
      );
    };

    return (
      <div
        className={`group flex flex-col border-b border-neutral-100 dark:border-white/5 last:border-0 transition-all duration-200 ${
          isExpanded ? "bg-neutral-50/50 dark:bg-white/[0.02]" : ""
        }`}
      >
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-start gap-4 py-3 px-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors relative ${
            log.level === "ERROR" || log.level === "CRIT"
              ? " bg-red-50/30 dark:bg-red-950/10"
              : log.level === "WARN"
                ? "bg-amber-50/30 dark:bg-amber-950/10"
                : "border-l-4 border-transparent"
          }`}
        >
          <div className="flex items-center gap-2 w-10 shrink-0 text-muted/30 dark:text-zinc-700 text-[0.7rem] font-bold tabular-nums pt-1">
            {isExpanded ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
            {log.lineNumber}
          </div>

          <div className="w-24 shrink-0 text-muted/40 dark:text-zinc-500 font-bold tabular-nums text-[0.75rem] pt-1">
            {log.timestamp}
          </div>

          <div className="w-24 shrink-0 flex items-start gap-1 pt-0.5">
            <span
              className={`px-2 py-0.5 rounded-full text-[0.6rem] font-black tracking-wider uppercase border ${
                log.level === "INFO"
                  ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50"
                  : log.level === "WARN"
                    ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-amber-900/50"
                    : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-500 border-red-100 dark:border-red-900/50"
              }`}
            >
              {log.level}
            </span>
            {log.data?.severity && (
              <span
                className={`px-1.5 py-0.5 rounded text-[0.6rem] font-black border ${
                  log.data.severity === "SEV1"
                    ? "bg-red-600 text-white border-red-700 shadow-sm"
                    : log.data.severity === "SEV2"
                      ? "bg-orange-500 text-white border-orange-600 shadow-sm"
                      : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-zinc-400 border-neutral-200 dark:border-zinc-700"
                }`}
              >
                {log.data.severity}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              {log.service && (
                <span className="text-[0.6rem] font-black text-muted dark:text-zinc-500 bg-neutral-200/50 dark:bg-zinc-800/50 px-1.5 py-0.5 rounded uppercase tracking-widest border border-neutral-300/50 dark:border-white/5">
                  {log.service}
                </span>
              )}
              {log.data?.metadata?.tags?.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-[0.55rem] font-bold text-primary/70 dark:text-primary/50 border border-primary/20 px-1 rounded uppercase"
                >
                  #{tag}
                </span>
              ))}
              {/* Inline Metrics for Heartbeats */}
              {log.data?.metadata?.tags?.includes("heartbeat") && (
                <div className="flex items-center gap-3 ml-2 border-l border-neutral-200 dark:border-white/10 pl-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.6rem] font-bold text-muted uppercase">
                      CPU:
                    </span>
                    <span className="text-[0.65rem] font-mono font-bold text-heading dark:text-zinc-300">
                      {(
                        (log.data.metadata.context.metrics?.cpu?.user || 0) /
                        1000000
                      ).toFixed(2)}
                      s
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.6rem] font-bold text-muted uppercase">
                      MEM:
                    </span>
                    <span className="text-[0.65rem] font-mono font-bold text-heading dark:text-zinc-300">
                      {Math.round(
                        (log.data.metadata.context.metrics?.memory?.rss || 0) /
                          1024 /
                          1024,
                      )}
                      MB
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div
              className={`wrap-break-word font-mono text-[0.85rem] leading-relaxed ${
                log.level === "CRIT"
                  ? "text-red-700 dark:text-red-400 font-bold"
                  : log.level === "ERROR"
                    ? "text-red-600 dark:text-red-400 font-medium"
                    : "text-heading dark:text-zinc-300 font-medium"
              }`}
            >
              {typeof log.message === "string" ? (
                filter.trim() ? (
                  <span>{highlightText(log.message, filter)}</span>
                ) : (
                  <Ansi linkify={false}>{log.message}</Ansi>
                )
              ) : (
                log.message
              )}
            </div>
          </div>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(String(log.message), "msg");
              }}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-white/10 shadow-sm border border-transparent hover:border-neutral-200 dark:hover:border-white/10 text-muted transition-all"
              title="Copy Message"
            >
              {copied ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-14 pb-4 pt-2 border-t border-neutral-100 dark:border-white/5 bg-neutral-50/30 dark:bg-black/20">
                <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0A0A0A] overflow-hidden shadow-inner-lg">
                  <div className="flex items-center justify-between px-4 py-2 bg-neutral-50 dark:bg-white/5 border-b border-neutral-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Info size={12} className="text-primary" />
                      <span className="text-[0.65rem] font-black uppercase tracking-widest text-muted">
                        Extended Context
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[0.6rem] font-mono text-muted/50 uppercase">
                        ID: {log.id}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(log.data, null, 2),
                            "json",
                          )
                        }
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-primary/50 text-[0.55rem] font-black uppercase tracking-widest text-muted hover:text-primary transition-all shadow-sm"
                      >
                        {jsonCopied ? (
                          <Check size={10} className="text-emerald-500" />
                        ) : (
                          <Copy size={10} />
                        )}
                        <span>{jsonCopied ? "Copied!" : "Copy JSON"}</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 font-mono text-[0.75rem] overflow-x-auto custom-scrollbar">
                    <pre className="text-neutral-600 dark:text-zinc-400 leading-relaxed">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

LogRow.displayName = "LogRow";

const LogTerminal: React.FC<LogTerminalProps> = ({
  logs,
  isPaused,
  droppedCount = 0,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);
  const autoScrollRef = useRef(true);

  // Constants for our Sliding Window approach
  const RENDER_WINDOW_SIZE = 200;

  // Filter and Slice logs to maintain a high-performance rendering window
  const visibleLogs = useMemo(() => {
    const filtered = logs.filter((log) => {
      const searchStr = filter.toLowerCase();
      const messageStr = typeof log.message === "string" ? log.message : "";
      return (
        messageStr.toLowerCase().includes(searchStr) ||
        log.level.toLowerCase().includes(searchStr) ||
        (log.service && log.service.toLowerCase().includes(searchStr))
      );
    });
    // Keep only the latest N logs for rendering
    return filtered.slice(-RENDER_WINDOW_SIZE);
  }, [logs, filter]);

  // Handle manual scroll to detect if we should continue auto-scrolling
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !isAutoScrollEnabled) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    // We are at the bottom if we're within a 50px buffer of the end
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    // Update both state (for UI button) and ref (for logic)
    if (isAtBottom !== autoScrollRef.current) {
      autoScrollRef.current = isAtBottom;
      setShouldAutoScroll(isAtBottom);
    }
  }, [isAutoScrollEnabled]);

  // Expert Auto-Scroll implementation using requestAnimationFrame for perfect synchronization
  const performScrollToBottom = useCallback(() => {
    if (scrollRef.current && autoScrollRef.current && isAutoScrollEnabled) {
      const element = scrollRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [isAutoScrollEnabled]);

  // Trigger scroll whenever logs change, if auto-scroll is enabled
  useEffect(() => {
    if (isAutoScrollEnabled && autoScrollRef.current && !isPaused) {
      performScrollToBottom();
    }
  }, [visibleLogs, isPaused, performScrollToBottom, isAutoScrollEnabled]);

  // Manual Jump to Latest
  const handleJumpToLatest = () => {
    setIsAutoScrollEnabled(true);
    autoScrollRef.current = true;
    setShouldAutoScroll(true);
    performScrollToBottom();
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-none border border-border dark:border-white/5 bg-white dark:bg-[#050505] shadow-premium relative">
      {/* Terminal Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border-soft dark:border-white/5 bg-white/80 dark:bg-[#080808]/80 px-6 backdrop-blur-xl relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex gap-2.5">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56] shadow-sm shadow-red-500/20" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E] shadow-sm shadow-amber-500/20" />
            <div className="h-3 w-3 rounded-full bg-[#27C93F] shadow-sm shadow-emerald-500/20" />
          </div>
          <div className="h-6 w-px bg-neutral-200 dark:bg-white/10" />
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-primary opacity-50" />
            <span className="text-[0.6rem] font-black uppercase tracking-widest text-muted">
              Tail Window: {visibleLogs.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div
            className={`flex items-center gap-2 px-3 rounded-xl border transition-all duration-300 ${
              isSearchFocused
                ? "bg-white dark:bg-white/5 border-primary shadow-sm"
                : "bg-neutral-50 dark:bg-white/[0.02] border-neutral-200 dark:border-white/5"
            }`}
          >
            <Search
              size={14}
              className={
                isSearchFocused ? "text-primary" : "text-muted opacity-50"
              }
            />
            <input
              type="text"
              value={filter}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter current view..."
              className="w-48 sm:w-64 border-none bg-transparent font-mono text-[0.75rem] text-heading dark:text-zinc-200 placeholder:text-muted/40 dark:placeholder:text-zinc-700 outline-none focus:ring-0 font-medium"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const next = !isAutoScrollEnabled;
                setIsAutoScrollEnabled(next);
                if (next) {
                  autoScrollRef.current = true;
                  setShouldAutoScroll(true);
                  performScrollToBottom();
                } else {
                  autoScrollRef.current = false;
                  setShouldAutoScroll(false);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                isAutoScrollEnabled
                  ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                  : "bg-neutral-100 dark:bg-white/5 border-neutral-200 dark:border-white/10 text-muted grayscale"
              }`}
              title={
                isAutoScrollEnabled
                  ? "Auto-scroll enabled"
                  : "Auto-scroll disabled"
              }
            >
              {isAutoScrollEnabled ? (
                <Zap size={14} className="fill-current" />
              ) : (
                <MousePointer2 size={14} />
              )}
              <span className="text-[0.6rem] font-black uppercase tracking-widest hidden sm:inline">
                {isAutoScrollEnabled ? "Auto-Scroll: ON" : "Auto-Scroll: OFF"}
              </span>
            </button>

            {droppedCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-sm">
                <span className="font-mono text-[0.6rem] font-black text-amber-600 uppercase tracking-widest">
                  {droppedCount} dropped
                </span>
              </div>
            )}
            <div className="h-4 w-px bg-neutral-200 dark:bg-white/10" />
            <span className="font-mono text-[0.65rem] font-black text-muted/40 dark:text-zinc-600 uppercase tracking-widest">
              {logs.length} in buffer
            </span>
          </div>
        </div>
      </div>

      {/* Terminal Content - Sliding Window implementation */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar relative z-10 bg-white dark:bg-[#050505]"
      >
        {/* Sticky Headers */}
        <div className="sticky top-0 z-20 flex gap-4 px-8 py-3 bg-neutral-50/80 dark:bg-[#080808]/80 backdrop-blur-md border-b border-neutral-200 dark:border-white/5 font-mono text-[0.6rem] font-black uppercase tracking-[0.25em] text-muted/50 dark:text-zinc-600">
          <div className="w-10 text-left">LN</div>
          <div className="w-24 text-center">TIMESTAMP</div>
          <div className="w-24 text-center">LEVEL</div>
          <div className="flex-1">MESSAGE & CONTEXT</div>
        </div>

        {/* The Sliding Window: Last 200 logs */}
        <div className="flex flex-col min-h-full">
          {visibleLogs.map((log) => (
            <LogRow key={log.id} log={log} filter={filter} />
          ))}

          {!isPaused && logs.length > 0 && (
            <div className="m-8 flex items-center gap-3 py-2 px-5 rounded-full bg-emerald-500/5 border border-emerald-500/10 w-fit shadow-none animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-500/80">
                Connected to Bus
              </span>
            </div>
          )}

          {visibleLogs.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-32 text-center opacity-40">
              <div className="p-4 rounded-full bg-neutral-100 dark:bg-white/5 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-1">
                Window Empty
              </h3>
              <p className="text-xs font-medium max-w-[200px]">
                No recent events matching current window constraints.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Smart Scroll to Latest Button */}
      <AnimatePresence>
        {!shouldAutoScroll && visibleLogs.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            onClick={handleJumpToLatest}
            className="absolute bottom-16 left-1/2 z-30 flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-black shadow-2xl shadow-primary/40 font-black text-[0.65rem] uppercase tracking-[0.2em] active:scale-95 transition-all border border-white/20"
          >
            <ArrowDown size={14} className="animate-bounce" />
            <span>Jump to Latest</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Terminal Footer */}
      <div className="flex h-12 shrink-0 items-center justify-between border-t border-border-soft dark:border-white/5 bg-neutral-50/50 dark:bg-white/5 px-6 backdrop-blur-xl relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
            <span className="font-mono text-[0.65rem] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
              Live Link
            </span>
          </div>
          <div className="h-4 w-px bg-neutral-200 dark:bg-white/10" />
          <span className="text-[0.65rem] font-mono text-muted/50 dark:text-zinc-600 font-bold uppercase">
            Window: 200 / Buffer: {logs.length}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[0.6rem] font-bold text-muted/40 uppercase tracking-tighter">
            Hardware Accelerated Rendering
          </span>
          <div className="h-4 w-px bg-neutral-200 dark:bg-white/10" />
          <span className="text-[0.65rem] font-black text-muted/30 dark:text-zinc-800 uppercase tracking-tighter">
            IW-TERMINAL-V3
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogTerminal;
