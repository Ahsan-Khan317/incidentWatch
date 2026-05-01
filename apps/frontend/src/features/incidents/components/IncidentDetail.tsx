"use client";
import React from "react";
import { motion } from "framer-motion";
import { Incident } from "../types";

interface IncidentDetailProps {
  incident: Incident;
  onClose: () => void;
}

export const IncidentDetail: React.FC<IncidentDetailProps> = ({
  incident,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between border-b border-border-soft pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-md border border-border-soft flex items-center justify-center hover:bg-surface-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-2xl font-display font-bold text-heading tracking-tight">
            {incident.title}
          </h2>
        </div>
        <button className="px-5 py-2 bg-primary text-white text-sm font-bold rounded-md shadow-md">
          Resolve
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-1 border border-border-soft p-6 rounded-md shadow-sm">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">
              Diagnostic Context
            </h3>
            <p className="text-body mb-4">{incident.description}</p>
            <div className="p-4 bg-surface-2 border border-border-soft rounded font-mono text-[11px] text-muted whitespace-pre overflow-x-auto">
              {`ERROR 2024-05-01T18:10:00.442Z\n[worker-01] OutOfMemoryError: GC overhead limit exceeded`}
            </div>
          </div>

          <div className="bg-surface-1 border border-border-soft p-6 rounded-md shadow-sm">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-6">
              Activity Timeline
            </h3>
            <div className="space-y-6 relative ml-4">
              <div className="absolute left-[3px] top-2 bottom-2 w-px bg-border-soft" />
              {incident.timeline.map((event) => (
                <div key={event.id} className="flex gap-6 relative">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_var(--color-primary)]" />
                  <div>
                    <p className="text-sm font-bold text-heading">
                      {event.message}
                    </p>
                    <p className="text-[10px] text-muted font-bold uppercase mt-1">
                      {event.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-1 border border-border-soft p-6 rounded-md shadow-sm">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">
              Metadata
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted">STATUS</span>
                <span className="text-primary">{incident.status}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted">SEVERITY</span>
                <span className="text-danger">
                  {incident.severity.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted">ASSIGNED</span>
                <span className="text-heading">{incident.assignedTo}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
