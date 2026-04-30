"use client";
import React from "react";
import { Activity } from "lucide-react";

export const StatusView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-success/10 border border-success/20 rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-success">
            All Systems Operational
          </h3>
          <p className="text-[11px] text-success/80">
            Last incident resolved 2 hours ago.
          </p>
        </div>
        <Activity size={32} className="text-success opacity-40" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          "API Gateway",
          "Database",
          "Authentication",
          "Storage",
          "Payments",
          "Dashboard",
        ].map((s) => (
          <div
            key={s}
            className="p-4 bg-surface-2 border border-border-soft rounded-xl flex items-center justify-between"
          >
            <span className="text-xs font-bold text-heading uppercase tracking-tight">
              {s}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-success uppercase">
                Operational
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">
          Historical Reliability
        </p>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-2">
              {Array.from({ length: 40 }).map((_, j) => (
                <div
                  key={j}
                  className="flex-1 h-6 bg-success/80 rounded-sm hover:bg-success transition-colors"
                  title={`99.9${j}% uptime`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
