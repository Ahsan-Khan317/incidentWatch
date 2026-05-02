import React from "react";
import { motion } from "framer-motion";
import { LogEntry } from "../pages/LogsView";

interface LogStatsProps {
  logs: LogEntry[];
  isPaused: boolean;
}

const LogStats: React.FC<LogStatsProps> = ({ logs, isPaused }) => {
  // Simulate some stats based on logs
  const eventVelocity = isPaused ? 0 : (Math.random() * 5 + 2).toFixed(1);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[0.65rem] font-black uppercase tracking-widest text-neutral-400">
            Event Velocity
          </span>
          <span
            className={`font-mono text-xs font-bold ${isPaused ? "text-neutral-300" : "text-primary"}`}
          >
            {eventVelocity}{" "}
            <span className="text-[0.6rem] opacity-50 uppercase tracking-tighter">
              REQ/S
            </span>
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 border border-neutral-200">
          <motion.div
            animate={{ width: isPaused ? "0%" : "75%" }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary shadow-sm"
          />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[0.65rem] font-black uppercase tracking-widest text-neutral-400">
            Buffer Usage
          </span>
          <span className="font-mono text-xs font-bold text-info">
            {logs.length}%
          </span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`h-10 flex-1 rounded-md border transition-all duration-300 ${
                i < logs.length / 16.6
                  ? "border-info/30 bg-info/5 shadow-sm"
                  : "border-neutral-100 bg-neutral-50/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[0.65rem] font-black uppercase tracking-widest text-neutral-400">
            Active Shards
          </span>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[0.6rem] font-black text-emerald-500/50 uppercase tracking-tighter">
              Syncing
            </span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                opacity: !isPaused && Math.random() > 0.3 ? 1 : 0.3,
                scale: !isPaused && Math.random() > 0.8 ? [1, 1.05, 1] : 1,
              }}
              className={`h-7 rounded-md border transition-all duration-500 ${
                !isPaused && Math.random() > 0.3
                  ? "border-primary/30 bg-primary/5"
                  : "border-neutral-100 bg-neutral-50/30"
              }`}
            />
          ))}
        </div>
        <p className="mt-5 text-[0.7rem] text-neutral-400 leading-relaxed font-medium">
          Telemetry distributed across{" "}
          <span className="text-neutral-700 font-bold">8 cluster nodes</span>.
        </p>
      </div>
    </div>
  );
};

export default LogStats;
