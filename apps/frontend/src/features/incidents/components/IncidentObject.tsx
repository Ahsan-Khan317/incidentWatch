"use client";
import React from "react";
import { motion } from "framer-motion";
import { Incident } from "../types";

interface IncidentObjectProps {
  incident: Incident;
  onClick: () => void;
}

export const IncidentObject: React.FC<IncidentObjectProps> = ({
  incident,
  onClick,
}) => {
  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case "critical":
        return {
          bg: "bg-danger-soft",
          border: "border-danger/30",
          text: "text-danger",
          glow: "shadow-[0_0_12px_rgba(220,38,38,0.2)]",
          code: "1",
        };
      case "high":
        return {
          bg: "bg-warning-soft",
          border: "border-warning/30",
          text: "text-warning",
          glow: "shadow-[0_0_12px_rgba(217,119,6,0.15)]",
          code: "2",
        };
      default:
        return {
          bg: "bg-info-soft",
          border: "border-info/30",
          text: "text-info",
          glow: "shadow-[0_0_12px_rgba(37,99,235,0.15)]",
          code: "3",
        };
    }
  };

  const style = getSeverityStyle(incident.severity);

  return (
    <motion.div
      layoutId={incident.id}
      onClick={onClick}
      whileHover={{ x: 6, borderColor: "var(--color-primary-soft)" }}
      className="bg-surface-1 border border-border-soft p-5 rounded-md shadow-sm cursor-pointer transition-all flex items-center justify-between group relative overflow-hidden"
    >
      {/* Decorative Severity Stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${style.bg} ${style.text === "text-danger" ? "bg-danger" : style.text === "text-warning" ? "bg-warning" : "bg-info"}`}
      />

      <div className="flex items-center gap-6">
        <div
          className={`w-12 h-12 rounded border flex flex-col items-center justify-center font-mono font-bold ${style.bg} ${style.border} ${style.text} ${style.glow}`}
        >
          <span className="text-[8px] uppercase tracking-tighter opacity-70">
            SEV
          </span>
          <span className="text-xl leading-none">{style.code}</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-black text-primary/80 tracking-tight">
              {incident.id}
            </span>
            <h4 className="font-bold text-heading text-[15px] group-hover:text-primary transition-colors">
              {incident.title}
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-muted font-black uppercase tracking-widest">
              {incident.type}
            </span>
            <span className="w-1 h-1 rounded-full bg-border-strong" />
            <span className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">
              {incident.createdAt}
            </span>
            <span className="w-1 h-1 rounded-full bg-border-strong" />
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-surface-2 border border-border-soft">
              <span className="material-symbols-outlined text-[12px] text-muted">
                person
              </span>
              <span className="text-[9px] font-bold text-heading uppercase tracking-tighter">
                {incident.assignedTo}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black text-muted uppercase tracking-[0.2em] mb-1">
            Status
          </span>
          <div className="px-2 py-1 bg-surface-2 border border-border-soft rounded-[4px] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(74,222,128,0.5)] animate-pulse" />
            <span className="text-[10px] font-black text-heading uppercase">
              {incident.status}
            </span>
          </div>
        </div>
        <span className="material-symbols-outlined text-muted group-hover:text-primary group-hover:translate-x-1 transition-all">
          arrow_forward
        </span>
      </div>
    </motion.div>
  );
};
