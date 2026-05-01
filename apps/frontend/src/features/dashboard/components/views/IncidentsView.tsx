"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineEvent {
  id: string;
  type: "assignment" | "status_change" | "comment" | "detection";
  user?: { name: string; avatar?: string };
  message: string;
  timestamp: string;
}

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  server: {
    name: string;
    id: string;
    region: string;
    ip: string;
  };
  type: string;
  status:
    | "Investigating"
    | "Monitoring"
    | "Resolved"
    | "Identified"
    | "Triggered";
  duration: string;
  createdAt: string;
  description: string;
  assignedTo?: string;
  timeline: TimelineEvent[];
}

export const IncidentsView: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );

  const incidents: Incident[] = [
    {
      id: "INC-442",
      title: "Memory Leak Detected in Production",
      severity: "critical",
      server: {
        name: "DB-CLUSTER-01",
        id: "srv-9921",
        region: "us-east-1",
        ip: "10.0.4.12",
      },
      type: "Infrastructure",
      status: "Investigating",
      duration: "14m",
      createdAt: "2024-05-01 18:10:00",
      description:
        "Heap usage exceeded 90% threshold for more than 5 minutes. Node process is unresponsive.",
      assignedTo: "Marcus Thorne",
      timeline: [
        {
          id: "1",
          type: "detection",
          message: "Incident triggered by npm-probe v2.4.0",
          timestamp: "18:10:00",
        },
        {
          id: "2",
          type: "assignment",
          message: "Auto-assigned to Marcus Thorne (On-Call)",
          timestamp: "18:10:05",
        },
        {
          id: "3",
          type: "status_change",
          message: "Status changed from Triggered to Investigating",
          timestamp: "18:12:30",
        },
        {
          id: "4",
          type: "comment",
          user: { name: "Marcus Thorne" },
          message:
            "Checking heap dumps now. Looks like a buffer overflow in the auth middleware.",
          timestamp: "18:14:00",
        },
      ],
    },
    {
      id: "INC-441",
      title: "Authentication Service Latency",
      severity: "high",
      server: {
        name: "AUTH-SERVICE-V2",
        id: "srv-4432",
        region: "eu-west-1",
        ip: "10.0.8.44",
      },
      type: "API",
      status: "Monitoring",
      duration: "1h 45m",
      createdAt: "2024-05-01 16:30:00",
      description:
        "P99 latency spiked to 2.4s. Circuit breaker is currently open.",
      assignedTo: "Sarah Liao",
      timeline: [
        {
          id: "1",
          type: "detection",
          message: "Latency threshold (500ms) exceeded",
          timestamp: "16:30:00",
        },
        {
          id: "2",
          type: "assignment",
          message: "Auto-assigned to Sarah Liao",
          timestamp: "16:30:10",
        },
      ],
    },
    {
      id: "INC-440",
      title: "Redis Connection Timeout",
      severity: "medium",
      server: {
        name: "CACHE-NODE-04",
        id: "srv-1120",
        region: "us-west-2",
        ip: "10.1.2.99",
      },
      type: "Database",
      status: "Resolved",
      duration: "42m",
      createdAt: "2024-05-01 14:20:00",
      description:
        "Failed to connect to Redis master. Failover initiated automatically.",
      assignedTo: "James Dean",
      timeline: [
        {
          id: "1",
          type: "detection",
          message: "Connection refused on port 6379",
          timestamp: "14:20:00",
        },
        {
          id: "2",
          type: "status_change",
          message: "Status changed to Resolved",
          timestamp: "15:02:00",
        },
      ],
    },
  ];

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-danger-soft border-danger-border text-danger";
      case "high":
        return "bg-warning-soft border-warning-border text-warning";
      case "medium":
        return "bg-info-soft border-info-border text-info";
      default:
        return "bg-surface-3 border-border text-muted";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "detection":
        return "radar";
      case "assignment":
        return "person_add";
      case "status_change":
        return "sync_alt";
      case "comment":
        return "chat_bubble";
      default:
        return "info";
    }
  };

  return (
    <motion.div
      key="incidents-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 min-h-[600px]"
    >
      <AnimatePresence mode="wait">
        {!selectedIncident ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-surface-1 border border-border-soft p-4 rounded-md flex flex-col gap-1 shadow-sm">
                <span className="text-xs font-bold text-muted uppercase tracking-widest">
                  Active Incidents
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold text-heading">
                    02
                  </span>
                  <span className="text-xs text-danger font-medium">
                    +1 vs avg
                  </span>
                </div>
              </div>
              <div className="bg-surface-1 border border-border-soft p-4 rounded-md flex flex-col gap-1 shadow-sm">
                <span className="text-xs font-bold text-muted uppercase tracking-widest">
                  Connected Servers
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold text-heading">
                    124
                  </span>
                </div>
              </div>
              <div className="bg-surface-1 border border-border-soft p-4 rounded-md flex flex-col gap-1 shadow-sm">
                <span className="text-xs font-bold text-muted uppercase tracking-widest">
                  Auto-Assignments
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold text-heading">
                    100%
                  </span>
                </div>
              </div>
              <div className="bg-success-soft border border-success-border p-4 rounded-md flex flex-col gap-1 shadow-sm">
                <span className="text-xs font-bold text-success uppercase tracking-widest">
                  npm-probe Status
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  <span className="text-sm font-bold text-success-text">
                    All Systems Live
                  </span>
                </div>
              </div>
            </div>

            {/* List Controls */}
            <div className="flex justify-between items-center px-1">
              <h3 className="text-lg font-display font-bold text-heading tracking-tight">
                Active Incident Stream
              </h3>
              <div className="flex gap-2">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-muted text-sm">
                    search
                  </span>
                  <input
                    className="bg-surface-1 border border-border-soft rounded-md pl-9 pr-4 py-1.5 text-sm focus:border-primary outline-none transition-colors text-heading w-64 shadow-sm"
                    placeholder="Search servers or IDs..."
                  />
                </div>
              </div>
            </div>

            {/* Incident Cards (Objects) */}
            <div className="grid gap-4">
              {incidents.map((incident) => (
                <motion.div
                  key={incident.id}
                  layoutId={incident.id}
                  onClick={() => setSelectedIncident(incident)}
                  whileHover={{
                    y: -2,
                    borderColor: "var(--color-primary-soft)",
                  }}
                  className="bg-surface-1 border border-border-soft p-5 rounded-md shadow-sm cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-12 h-12 rounded-md flex flex-col items-center justify-center font-mono font-bold text-[10px] border ${getSeverityStyles(incident.severity)} shadow-sm`}
                    >
                      <span>SEV</span>
                      <span className="text-lg leading-none">
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
                        <h4 className="font-bold text-heading">
                          {incident.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] font-bold text-muted uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            dns
                          </span>
                          {incident.server.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            schedule
                          </span>
                          {incident.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            person
                          </span>
                          {incident.assignedTo || "Unassigned"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-bold text-heading">
                        {incident.status}
                      </div>
                      <div className="text-[10px] text-muted font-mono">
                        {incident.server.region}
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-muted group-hover:text-primary transition-colors">
                      chevron_right
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6 pb-20"
          >
            {/* Header / Back */}
            <div className="flex items-center justify-between border-b border-border-soft pb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="w-10 h-10 rounded-md border border-border-soft flex items-center justify-center hover:bg-surface-2 transition-colors text-muted hover:text-heading shadow-sm"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-primary">
                      {selectedIncident.id}
                    </span>
                    <h2 className="text-2xl font-display font-bold text-heading tracking-tight">
                      {selectedIncident.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted font-medium">
                    Triggered on {selectedIncident.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-md shadow-md hover:brightness-110 transition-all">
                  Resolve Incident
                </button>
                <button className="px-4 py-2 border border-border-soft text-heading text-sm font-bold rounded-md hover:bg-surface-2 transition-colors shadow-sm">
                  Acknowledge
                </button>
              </div>
            </div>

            {/* Grid Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Description Box */}
                <div className="bg-surface-1 border border-border-soft p-6 rounded-md shadow-sm">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">
                    Summary & Impact
                  </h3>
                  <p className="text-body font-medium leading-relaxed">
                    {selectedIncident.description}
                  </p>
                </div>

                {/* Server Info "Object" */}
                <div className="bg-surface-1 border border-border-soft rounded-md overflow-hidden shadow-sm">
                  <div className="bg-surface-2 px-6 py-3 border-b border-border-soft flex justify-between items-center">
                    <span className="text-xs font-bold text-heading uppercase tracking-widest">
                      Source Infrastructure
                    </span>
                    <span className="px-2 py-0.5 bg-success-soft text-success text-[10px] font-bold rounded border border-success-border">
                      CONNECTED
                    </span>
                  </div>
                  <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-muted uppercase mb-1">
                        Hostname
                      </div>
                      <div className="text-sm font-mono font-bold text-heading">
                        {selectedIncident.server.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-muted uppercase mb-1">
                        IP Address
                      </div>
                      <div className="text-sm font-mono font-bold text-heading">
                        {selectedIncident.server.ip}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-muted uppercase mb-1">
                        Region
                      </div>
                      <div className="text-sm font-bold text-heading">
                        {selectedIncident.server.region}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-muted uppercase mb-1">
                        Server ID
                      </div>
                      <div className="text-sm font-mono font-bold text-heading">
                        {selectedIncident.server.id}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-display font-bold text-heading tracking-tight px-1">
                    Incident Timeline
                  </h3>
                  <div className="bg-surface-1 border border-border-soft p-8 rounded-md shadow-sm relative overflow-hidden">
                    <div className="absolute left-[47px] top-10 bottom-10 w-px bg-border-soft"></div>
                    <div className="space-y-8 relative z-10">
                      {selectedIncident.timeline.map((event) => (
                        <div key={event.id} className="flex gap-6">
                          <div className="w-8 h-8 rounded-md bg-surface-1 border border-border-soft flex items-center justify-center shadow-sm z-10">
                            <span className="material-symbols-outlined text-sm text-primary">
                              {getEventIcon(event.type)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-bold text-heading">
                                {event.user ? (
                                  <span className="text-primary">
                                    {event.user.name}:{" "}
                                  </span>
                                ) : null}
                                {event.message}
                              </span>
                              <span className="text-[10px] font-mono font-bold text-muted">
                                {event.timestamp}
                              </span>
                            </div>
                            {event.type === "detection" && (
                              <div className="mt-2 p-3 bg-surface-2 border border-border-soft rounded font-mono text-[11px] text-muted">
                                {
                                  '{ "probe": "npm-incident-watch", "version": "2.4.0", "status": "alert", "payload": "heap_dump_available" }'
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-6 border-t border-border-soft">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-md bg-primary-soft text-primary flex items-center justify-center font-bold text-xs">
                          AD
                        </div>
                        <input
                          className="flex-1 bg-surface-2 border border-border-soft rounded-md px-4 py-2 text-sm focus:border-primary outline-none transition-colors text-heading"
                          placeholder="Add a note or update for the team..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Details */}
              <div className="space-y-6">
                <div className="bg-surface-1 border border-border-soft p-6 rounded-md shadow-sm">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">
                    Metadata
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border-soft/50">
                      <span className="text-xs text-muted font-bold">
                        Severity
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getSeverityStyles(selectedIncident.severity)}`}
                      >
                        {selectedIncident.severity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border-soft/50">
                      <span className="text-xs text-muted font-bold">
                        Category
                      </span>
                      <span className="text-xs font-bold text-heading uppercase">
                        {selectedIncident.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-muted font-bold">
                        Assigned Engineer
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-info-soft text-info flex items-center justify-center text-[10px] font-bold">
                          MT
                        </div>
                        <span className="text-xs font-bold text-heading">
                          {selectedIncident.assignedTo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 p-6 rounded-md shadow-sm">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                    Auto-Assignment Logic
                  </h3>
                  <p className="text-[11px] text-body font-medium leading-relaxed">
                    This incident was automatically assigned to{" "}
                    <strong>{selectedIncident.assignedTo}</strong> based on the{" "}
                    <strong>{selectedIncident.type}</strong> expertise tag and
                    current on-call rotation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
