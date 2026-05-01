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
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "critical":
        return "text-danger border-danger-border bg-danger-soft";
      case "high":
        return "text-warning border-warning-border bg-warning-soft";
      default:
        return "text-info border-info-border bg-info-soft";
    }
  };

  return (
    <motion.div
      layoutId={incident.id}
      onClick={onClick}
      whileHover={{ x: 4, borderColor: "var(--color-primary-soft)" }}
      className="bg-surface-1 border border-border-soft p-4 rounded-md shadow-sm cursor-pointer transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-5">
        <div
          className={`w-10 h-10 rounded border flex flex-col items-center justify-center font-mono font-bold text-[9px] ${getSeverityColor(incident.severity)}`}
        >
          <span>SEV</span>
          <span className="text-base leading-none">
            {incident.severity === "critical"
              ? "1"
              : incident.severity === "high"
                ? "2"
                : "3"}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xs font-bold text-primary">
              {incident.id}
            </span>
            <h4 className="font-bold text-heading text-sm">{incident.title}</h4>
          </div>
          <p className="text-[10px] text-muted font-bold uppercase tracking-widest">
            {incident.type} • {incident.createdAt}
          </p>
        </div>
      </div>
      <span className="material-symbols-outlined text-muted group-hover:text-primary transition-all">
        chevron_right
      </span>
    </motion.div>
  );
};
