import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { LogEntry } from "../pages/LogsView";

interface LogStatsProps {
  logs: LogEntry[];
  isPaused: boolean;
}

const LogStats: React.FC<LogStatsProps> = ({ logs, isPaused }) => {
  const eventVelocity = useMemo(
    () => (isPaused ? 0 : (1.2 + Math.random() * 0.5).toFixed(1)),
    [isPaused, logs.length],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded border border-border bg-surface-1 p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.625rem] font-bold uppercase tracking-tight text-muted">
            Event Velocity
          </span>
          <span
            className={`text-xs font-bold ${isPaused ? "text-muted" : "text-primary"}`}
          >
            {eventVelocity}k/s
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2 border border-border">
          <motion.div
            animate={{ width: isPaused ? "0%" : "75%" }}
            className="h-full rounded-full bg-primary"
          />
        </div>
      </div>

      <div className="rounded border border-border bg-surface-1 p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.625rem] font-bold uppercase tracking-tight text-muted">
            Buffer Usage
          </span>
          <span className="text-[0.625rem] font-bold text-info">
            {logs.length}%
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-8 flex-1 rounded-sm border transition-colors ${
                i < logs.length / 20
                  ? "border-info-border bg-info-soft"
                  : "border-border bg-surface-2"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="rounded border border-border bg-surface-1 p-4 shadow-sm">
        <span className="text-[0.625rem] font-bold uppercase tracking-tight text-muted">
          Active Shards
        </span>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`h-6 rounded border transition-all ${
                !isPaused && Math.random() > 0.3
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-border bg-surface-2"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-[0.625rem] text-body">
          Monitoring across{" "}
          <span className="text-heading">8 cluster nodes</span>.
        </p>
      </div>
    </div>
  );
};

export default LogStats;
