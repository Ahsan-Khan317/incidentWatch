"use client";
import React from "react";
import { motion } from "framer-motion";
import { useIncidents } from "../hooks/useIncidents";
import { Incident } from "../types";

interface IncidentDetailProps {
  incident: Incident;
  onClose: () => void;
}

export const IncidentDetail: React.FC<IncidentDetailProps> = ({
  incident,
  onClose,
}) => {
  const { acknowledgeIncident, resolveIncident, refresh } = useIncidents();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleAcknowledge = async () => {
    setIsProcessing(true);
    await acknowledgeIncident(incident.id);
    setIsProcessing(false);
  };

  const handleResolve = async () => {
    setIsProcessing(true);
    await resolveIncident(incident.id);
    setIsProcessing(false);
  };

  const isResolved = incident.status === "Resolved";
  const isAcknowledged = incident.status === "Investigating";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8 pb-20"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border-soft pb-8">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <button
            onClick={onClose}
            className="group w-12 h-12 shrink-0 rounded-md border border-border-soft flex items-center justify-center hover:bg-surface-2 transition-all"
          >
            <span className="material-symbols-outlined text-muted group-hover:text-primary group-hover:-translate-x-1 transition-all">
              arrow_back
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1">
              <span
                className={`px-2 py-0.5 border text-[10px] font-black uppercase tracking-tighter rounded shrink-0 ${
                  isResolved
                    ? "bg-success-soft text-success border-success-border"
                    : isAcknowledged
                      ? "bg-warning-soft text-warning border-warning-border"
                      : "bg-danger-soft text-danger border-danger-border"
                }`}
              >
                {incident.status.toUpperCase()}
              </span>
              <span className="font-mono text-xs font-black text-muted tracking-widest uppercase opacity-40 shrink-0">
                {incident.displayId}
              </span>
            </div>
            <h2 className="text-3xl font-display font-black text-heading tracking-tighter uppercase break-words leading-none mt-2 truncate">
              {incident.title}
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {!isResolved && !isAcknowledged && (
            <button
              onClick={handleAcknowledge}
              disabled={isProcessing}
              className="px-6 py-2.5 border border-border-soft text-muted text-xs font-bold rounded-md hover:bg-surface-2 transition-all disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Acknowledge"}
            </button>
          )}
          {!isResolved && (
            <button
              onClick={handleResolve}
              disabled={isProcessing}
              className="px-8 py-2.5 bg-primary text-white text-xs font-bold rounded-md shadow-lg hover:brightness-110 shadow-primary transition-all uppercase tracking-widest disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Resolve Incident"}
            </button>
          )}
          {isResolved && (
            <div className="px-6 py-2.5 bg-success/10 text-success border border-success/30 text-xs font-black uppercase tracking-widest rounded-md">
              Fixed & Resolved
            </div>
          )}
        </div>
      </div>

      {/* Tactical Lifecycle Stepper */}
      <div className="grid grid-cols-3 gap-1 bg-surface-2 p-1 border border-border-soft rounded-md">
        <div
          className={`flex flex-col items-center py-3 px-2 rounded-sm transition-all duration-500 ${
            !isAcknowledged && !isResolved
              ? "bg-danger/10 border border-danger/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
              : "opacity-40"
          }`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full mb-2 ${!isAcknowledged && !isResolved ? "bg-danger animate-pulse" : "bg-muted"}`}
          />
          <span
            className={`text-[9px] font-black uppercase tracking-[0.2em] ${!isAcknowledged && !isResolved ? "text-danger" : "text-muted"}`}
          >
            Stage 01: Triggered
          </span>
        </div>

        <div
          className={`flex flex-col items-center py-3 px-2 rounded-sm transition-all duration-500 ${
            isAcknowledged
              ? "bg-warning/10 border border-warning/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
              : "opacity-40"
          }`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full mb-2 ${isAcknowledged ? "bg-warning animate-pulse" : "bg-muted"}`}
          />
          <span
            className={`text-[9px] font-black uppercase tracking-[0.2em] ${isAcknowledged ? "text-warning" : "text-muted"}`}
          >
            Stage 02: Investigating
          </span>
        </div>

        <div
          className={`flex flex-col items-center py-3 px-2 rounded-sm transition-all duration-500 ${
            isResolved
              ? "bg-success/10 border border-success/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              : "opacity-40"
          }`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full mb-2 ${isResolved ? "bg-success" : "bg-muted"}`}
          />
          <span
            className={`text-[9px] font-black uppercase tracking-[0.2em] ${isResolved ? "text-success" : "text-muted"}`}
          >
            Stage 03: Resolved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content (Logs & Timeline) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Diagnostic Context */}
          <section className="bg-surface-1 border border-border-soft rounded-md overflow-hidden shadow-sm">
            <div className="bg-surface-2 px-6 py-3 border-b border-border-soft flex items-center justify-between">
              <h3 className="text-[10px] font-black text-muted uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">
                  terminal
                </span>
                Diagnostic Context
              </h3>
              <span className="text-[10px] font-mono text-muted">
                streaming_raw.log
              </span>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-sm font-medium text-body leading-relaxed border-l-2 border-primary-soft pl-4">
                {incident.description}
              </p>

              <div className="group relative">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 bg-surface-3 rounded border border-border-soft text-muted hover:text-primary">
                    <span className="material-symbols-outlined text-sm">
                      content_copy
                    </span>
                  </button>
                </div>
                <pre className="p-5 bg-surface-0 border border-border-soft rounded-md font-mono text-[12px] leading-relaxed text-muted overflow-x-auto custom-scrollbar">
                  <code className="block border-b border-border-soft/30 pb-2 mb-2 text-[10px] text-zinc-600 uppercase font-black">
                    Raw Stack Trace
                  </code>
                  {incident.stack ||
                    incident.description ||
                    "No stack trace captured for this incident."}
                </pre>
              </div>
            </div>
          </section>

          {/* Lifecycle Timeline */}
          <section>
            <h3 className="text-[11px] font-black text-muted uppercase tracking-widest mb-8 px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">history</span>
              Incident Lifecycle
            </h3>
            <div className="relative ml-6 border-l border-border-soft space-y-12 pb-4">
              {incident.timeline.map((event, idx) => (
                <div key={event.id} className="relative pl-10">
                  {/* Timeline Node */}
                  <div
                    className={`absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-page z-10 ${idx === 0 ? "bg-primary shadow-[0_0_10px_var(--color-primary)]" : "bg-border-strong"}`}
                  />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-1 border border-border-soft p-4 rounded-md shadow-sm hover:border-primary-soft transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-surface-2 border border-border-soft flex items-center justify-center text-muted">
                        <span className="material-symbols-outlined text-xl">
                          {event.type === "detection"
                            ? "radar"
                            : event.type === "assignment"
                              ? "person_search"
                              : "notifications_active"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-heading leading-tight">
                          {event.message}
                        </p>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-tighter mt-1">
                          Automatic Event Node
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 bg-surface-2 rounded-full font-mono text-[11px] font-bold text-muted border border-border-soft">
                        {event.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar (Metadata) */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface-1 border border-border-soft rounded-md overflow-hidden shadow-md">
            <div className="bg-surface-2 px-6 py-4 border-b border-border-soft flex items-center justify-between">
              <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                Properties
              </h4>
              <span className="material-symbols-outlined text-sm text-primary">
                info
              </span>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {[
                  {
                    label: "Status",
                    value: incident.status,
                    color: "text-primary",
                  },
                  {
                    label: "Severity",
                    value: incident.severity.toUpperCase(),
                    color: "text-danger",
                  },
                  {
                    label: "Category",
                    value: incident.type,
                    color: "text-heading",
                  },
                  {
                    label: "Assignee",
                    value: incident.assignedTo,
                    color: "text-heading",
                  },
                  {
                    label: "Detected At",
                    value: incident.createdAt,
                    color: "text-muted",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center pb-3 border-b border-border-soft last:border-0 last:pb-0"
                  >
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">
                      {item.label}
                    </span>
                    <span
                      className={`text-[11px] font-black uppercase ${item.color}`}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-surface-1 border border-border-soft rounded-md overflow-hidden shadow-md">
            <div className="bg-surface-2 px-6 py-4 border-b border-border-soft flex items-center justify-between">
              <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">
                Responders
              </h4>
              <span className="material-symbols-outlined text-sm text-primary">
                person_search
              </span>
            </div>
            <div className="p-6 space-y-4">
              {incident.assignedMemberNames.length > 0 ? (
                incident.assignedMemberNames.map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between border border-border-soft bg-surface-2 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-border bg-surface-1 text-[10px] font-black text-primary">
                        {name.charAt(0)}
                      </span>
                      <span className="truncate text-xs font-bold text-heading">
                        {name}
                      </span>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">
                      Assigned
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] font-medium text-muted">
                  {incident.assignedMemberIds.length > 0 ||
                  incident.assignedTeamIds.length > 0
                    ? incident.assignedTo
                    : "No responder assigned yet."}
                </p>
              )}

              {incident.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {incident.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-border-soft bg-surface-2 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="bg-primary/5 border border-primary/20 p-6 rounded-md">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-primary">
                auto_fix
              </span>
              <h4 className="text-xs font-black text-primary uppercase tracking-widest">
                AI Insights
              </h4>
            </div>
            <p className="text-[11px] text-body leading-relaxed font-medium">
              This pattern matches 4 previous heap-related failures. We
              recommend checking the <strong>AuthMiddleware.js</strong>{" "}
              recursion depth in the current build.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
};
