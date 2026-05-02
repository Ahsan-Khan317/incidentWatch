"use client";
import React from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
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
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      case "high":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-primary bg-primary/10 border-primary/20";
    }
  };

  const severityClasses = getSeverityColor(incident.severity);

  return (
    <motion.div
      layoutId={incident.id}
      onClick={onClick}
      whileHover={{ scale: 1.005, backgroundColor: "var(--color-surface-2)" }}
      className="group relative flex cursor-pointer items-center justify-between border border-dashed border-border bg-surface-1/50 p-4 transition-all hover:border-primary/50"
    >
      {/* Left section: ID + Title + Meta */}
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded border font-mono text-xs font-bold ${severityClasses}`}
        >
          {incident.severity === "critical"
            ? "P1"
            : incident.severity === "high"
              ? "P2"
              : "P3"}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.625rem] font-bold text-body/30 tracking-tight">
              {incident.id.toUpperCase()}
            </span>
            <h4 className="text-sm font-bold text-heading group-hover:text-primary transition-colors">
              {incident.title}
            </h4>
          </div>

          <div className="flex items-center gap-2 text-[0.6875rem] text-body">
            <span className="uppercase tracking-widest text-body/30 font-bold text-[0.625rem]">
              {incident.type}
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-body/40">{incident.createdAt}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-full bg-surface-2 border border-border flex items-center justify-center text-[0.5rem] font-bold text-body/50">
                {incident?.assignedTo?.charAt(0)}
              </span>
              {incident.assignedTo}
            </span>
          </div>
        </div>
      </div>

      {/* Right section: Status + Arrow */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[0.625rem] font-bold uppercase tracking-widest text-body/20">
            Status
          </span>
          <div className="flex items-center gap-2 rounded border border-border bg-surface-2 px-2 py-1">
            <div
              className={`h-1.5 w-1.5 rounded-full ${incident.status === "Resolved" ? "bg-emerald-500" : "bg-primary animate-pulse"}`}
            />
            <span className="text-[0.625rem] font-bold uppercase text-heading">
              {incident.status}
            </span>
          </div>
        </div>

        <ChevronRight
          size={16}
          className="text-body/20 group-hover:text-primary group-hover:translate-x-1 transition-all"
        />
      </div>
    </motion.div>
  );
};
