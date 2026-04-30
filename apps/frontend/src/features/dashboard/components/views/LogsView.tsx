"use client";
import React from "react";
import { motion } from "framer-motion";

export const LogsView: React.FC = () => {
  return (
    <motion.div
      key="logs"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex flex-col h-full bg-surface-1 rounded-md border border-border-soft overflow-hidden relative"
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
          {/* Filters */}
          <div className="hidden md:flex items-center gap-1 bg-surface-2 border border-border-soft p-1 rounded-md">
            <select className="bg-transparent border-none text-xs font-bold text-muted focus:ring-0 cursor-pointer py-1 px-3 appearance-none outline-none">
              <option>Service: auth-gateway</option>
              <option>Service: payments-api</option>
              <option>Service: db-proxy</option>
            </select>
            <div className="h-4 w-px bg-border-soft mx-1"></div>
            <select className="bg-transparent border-none text-xs font-bold text-muted focus:ring-0 cursor-pointer py-1 px-3 appearance-none outline-none">
              <option>Level: ALL</option>
              <option>Level: ERROR</option>
              <option>Level: INFO</option>
            </select>
            <div className="h-4 w-px bg-border-soft mx-1"></div>
            <select className="bg-transparent border-none text-xs font-bold text-muted focus:ring-0 cursor-pointer py-1 px-3 appearance-none outline-none">
              <option>Time: Last 15m</option>
              <option>Time: Last 1h</option>
              <option>Time: Custom</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-border-soft rounded-md text-xs font-bold text-muted hover:bg-surface-2 transition-colors">
            <span className="material-symbols-outlined text-sm">search</span>
            <span>Search logs...</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-success-soft border border-success-border rounded-md">
            <div className="w-2 h-2 rounded-sm bg-success animate-pulse shadow-[0_0_8px_rgba(22,163,74,0.6)]"></div>
            <span className="text-xs font-bold text-success tracking-widest uppercase">
              LIVE
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <button className="p-1 hover:text-heading transition-colors rounded-md">
              <span className="material-symbols-outlined text-[20px]">
                file_download
              </span>
            </button>
            <button className="p-1 hover:text-heading transition-colors rounded-md">
              <span className="material-symbols-outlined text-[20px]">
                fullscreen
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Area: Terminal */}
      <div className="flex-1 bg-surface-0 relative overflow-hidden flex flex-col">
        {/* Terminal Window */}
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
                streaming_logs_v1.sh
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-muted">
              842 lines cached
            </span>
          </div>

          {/* Log Rows */}
          <div className="flex-1 overflow-y-auto custom-scrollbar scanning-line font-mono text-[13px] leading-relaxed p-4 pb-20">
            {/* Log Header */}
            <div className="flex gap-4 border-b border-border-soft pb-2 mb-4 text-muted uppercase tracking-widest text-[10px] font-bold">
              <div className="w-12">LN</div>
              <div className="w-32">TIMESTAMP</div>
              <div className="w-24">LEVEL</div>
              <div className="flex-1">MESSAGE</div>
            </div>

            {/* Log Entries */}
            <div className="space-y-1">
              <div className="flex gap-4 group hover:bg-surface-2 transition-colors py-0.5">
                <div className="w-12 text-zinc-600 select-none font-bold">
                  1024
                </div>
                <div className="w-32 text-muted">08:45:12.332</div>
                <div className="w-24 text-info font-bold">[INFO]</div>
                <div className="flex-1 text-body">
                  Incoming <span className="text-primary">GET</span> request
                  from <span className="text-muted">192.168.1.45</span> -{" "}
                  <span className="text-info">request_id</span>="req_9921_x3"
                </div>
              </div>

              <div className="flex gap-4 group hover:bg-surface-2 transition-colors py-0.5">
                <div className="w-12 text-zinc-600 select-none font-bold">
                  1025
                </div>
                <div className="w-32 text-muted">08:45:12.510</div>
                <div className="w-24 text-warning font-bold">[WARN]</div>
                <div className="flex-1 text-body">
                  High latency detected on{" "}
                  <span className="text-info">user_id</span>="usr_440" profile
                  lookup. Duration:{" "}
                  <span className="text-warning font-bold">1240ms</span>
                </div>
              </div>

              <div className="flex gap-4 group hover:bg-surface-2 transition-colors py-0.5 border-l-2 border-danger pl-2 -ml-[10px]">
                <div className="w-12 text-zinc-600 select-none font-bold">
                  1026
                </div>
                <div className="w-32 text-muted">08:45:13.001</div>
                <div className="w-24 text-danger font-bold">[ERROR]</div>
                <div className="flex-1 text-heading bg-danger-soft px-1 rounded-sm w-fit">
                  Database connection timeout for{" "}
                  <span className="text-info">shard_04</span>. Retrying in
                  500ms... <span className="text-danger">status_code</span>
                  ="504"
                </div>
              </div>

              <div className="flex gap-4 group hover:bg-surface-2 transition-colors py-0.5 border-l-2 border-[#ff0080] pl-2 -ml-[10px]">
                <div className="w-12 text-zinc-600 select-none font-bold">
                  1027
                </div>
                <div className="w-32 text-muted">08:45:13.442</div>
                <div className="w-24 text-[#ff0080] font-bold">[CRIT]</div>
                <div className="flex-1 text-heading bg-[#ff0080]/10 px-1 rounded-sm w-fit">
                  OOM Exception in{" "}
                  <span className="text-info">auth-gateway</span> worker #3.
                  Dumping heap...{" "}
                  <span className="text-[#ff0080] font-bold">SIGKILL</span>
                </div>
              </div>

              <div className="flex gap-4 group hover:bg-surface-2 transition-colors py-0.5">
                <div className="w-12 text-zinc-600 select-none font-bold">
                  1028
                </div>
                <div className="w-32 text-muted">08:45:14.110</div>
                <div className="w-24 text-success font-bold">[INFO]</div>
                <div className="flex-1 text-body">
                  Health check passed for{" "}
                  <span className="text-info">service_name</span>
                  ="redis-cluster"
                </div>
              </div>

              <div className="flex gap-4 group hover:bg-surface-2 transition-colors py-0.5">
                <div className="w-12 text-zinc-600 select-none font-bold">
                  1029
                </div>
                <div className="w-32 text-muted">08:45:14.550</div>
                <div className="w-24 text-info font-bold">[INFO]</div>
                <div className="flex-1 text-body">
                  <span className="text-primary">POST</span> /api/v1/auth/login{" "}
                  <span className="text-info">user_id</span>="usr_8821"{" "}
                  <span className="text-success font-bold">status_code</span>
                  ="200"
                </div>
              </div>

              <div className="flex gap-4 group hover:bg-surface-2 transition-colors py-0.5">
                <div className="w-12 text-zinc-600 select-none font-bold">
                  1030
                </div>
                <div className="w-32 text-muted">08:45:14.800</div>
                <div className="w-24 text-info font-bold">[INFO]</div>
                <div className="flex-1 text-body">
                  Garbage collection completed. Reclaimed{" "}
                  <span className="text-success font-bold">42MB</span> in 12ms.
                </div>
              </div>
            </div>

            {/* Typing Indicator */}
            <div className="mt-6 flex items-center gap-2 text-info animate-pulse">
              <span className="text-[10px]">_</span>
              <span className="text-[10px] tracking-widest font-bold uppercase">
                Listening for new events
              </span>
            </div>
          </div>

          {/* Footer / Command Line */}
          <div className="h-12 bg-surface-1 border-t border-border-soft px-4 flex items-center gap-3 shrink-0 absolute bottom-0 left-0 w-full z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
            <span className="text-success font-bold text-xs select-none">
              ❯
            </span>
            <input
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-xs font-mono text-heading placeholder-muted"
              placeholder="Type a command or filter regex..."
              type="text"
            />
            <div className="flex items-center gap-2">
              <kbd className="bg-surface-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-muted border border-border-soft">
                ⌘ K
              </kbd>
              <kbd className="bg-surface-2 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-muted border border-border-soft">
                ENTER
              </kbd>
            </div>
          </div>
        </div>

        {/* Subtle Info Cards Overlay (Right Bottom) */}
        <div className="absolute bottom-16 right-8 flex flex-col gap-3 pointer-events-none z-20">
          <div className="bg-surface-0/90 backdrop-blur-md border border-border-soft p-4 rounded-md w-64 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted uppercase tracking-tighter">
                Event Rate
              </span>
              <span className="text-success text-xs font-bold">1.2k/s</span>
            </div>
            <div className="h-1.5 w-full bg-surface-2 rounded-md overflow-hidden border border-border-soft">
              <div className="h-full bg-success w-3/4 rounded-md"></div>
            </div>
          </div>

          <div className="bg-surface-0/90 backdrop-blur-md border border-border-soft p-4 rounded-md w-64 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted uppercase tracking-tighter">
                System Health
              </span>
              <span className="text-success text-xs font-bold">Optimal</span>
            </div>
            <div className="flex gap-1">
              <div className="flex-1 h-8 bg-success-soft rounded-sm border border-success-border"></div>
              <div className="flex-1 h-8 bg-success-soft rounded-sm border border-success-border"></div>
              <div className="flex-1 h-8 bg-success-soft rounded-sm border border-success-border"></div>
              <div className="flex-1 h-8 bg-surface-2 rounded-sm border border-border-soft"></div>
              <div className="flex-1 h-8 bg-success-soft rounded-sm border border-success-border"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
