"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Incident } from "./types";
import { ServerCard } from "./components/ServerCard";
import { IncidentObject } from "./components/IncidentObject";
import { IncidentDetail } from "./components/IncidentDetail";

type ViewState = "SERVERS" | "SERVER_FOCUS" | "INCIDENT_DETAIL";

export const IncidentsView: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>("SERVERS");
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );

  const servers: Server[] = [
    {
      id: "srv-001",
      name: "API-GATEWAY-PROD",
      url: "https://api.prod.example.com",
      status: "online",
      incidentCount: 0,
      region: "US-EAST-1",
      lastPulse: "2s ago",
      tags: ["gateway"],
    },
    {
      id: "srv-002",
      name: "AUTH-SERVICE-V2",
      url: "https://auth.example.com",
      status: "degraded",
      incidentCount: 1,
      region: "EU-WEST-1",
      lastPulse: "14s ago",
      tags: ["auth", "java"],
    },
    {
      id: "srv-003",
      name: "DB-CLUSTER-MASTER",
      url: "10.0.4.12",
      status: "online",
      incidentCount: 1,
      region: "US-EAST-1",
      lastPulse: "1s ago",
      tags: ["database"],
    },
  ];

  const allIncidents: Incident[] = [
    {
      id: "INC-442",
      serverId: "srv-002",
      title: "Memory Leak in JVM Worker",
      severity: "critical",
      type: "Infrastructure",
      status: "Investigating",
      assignedTo: "Marcus Thorne",
      createdAt: "18:10:00",
      description:
        "Heap usage exceeded 90% threshold. detected recursive loop in auth middleware.",
      timeline: [
        {
          id: "1",
          type: "detection",
          message: "Regex match: 'OutOfMemoryError' found",
          timestamp: "18:10:00",
        },
        {
          id: "2",
          type: "assignment",
          message: "Auto-assigned to Marcus Thorne",
          timestamp: "18:10:05",
        },
      ],
    },
    {
      id: "INC-443",
      serverId: "srv-003",
      title: "Connection Pool Exhaustion",
      severity: "high",
      type: "Database",
      status: "Identified",
      assignedTo: "Sarah Liao",
      createdAt: "19:05:22",
      description:
        "Active connections peaked at 1000. New connection attempts timed out.",
      timeline: [
        {
          id: "1",
          type: "detection",
          message: "Connection pool reached 100% capacity",
          timestamp: "19:05:22",
        },
      ],
    },
  ];

  const handleServerClick = (server: Server) => {
    setSelectedServer(server);
    setViewState("SERVER_FOCUS");
  };

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setViewState("INCIDENT_DETAIL");
  };

  const handleBackToServers = () => {
    setSelectedServer(null);
    setViewState("SERVERS");
  };

  const handleBackToFocus = () => {
    setSelectedIncident(null);
    setViewState("SERVER_FOCUS");
  };

  return (
    <div className="min-h-[500px]">
      <AnimatePresence mode="wait">
        {viewState === "SERVERS" && (
          <motion.div
            key="layer-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="px-1">
              <h2 className="text-2xl font-display font-bold text-heading tracking-tight">
                Infrastructure Fleet
              </h2>
              <p className="text-sm text-muted font-medium mt-1 uppercase tracking-widest">
                Select a server to inspect its incidents
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {servers.map((server) => (
                <ServerCard
                  key={server.id}
                  server={server}
                  isActive={false}
                  onClick={() => handleServerClick(server)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {viewState === "SERVER_FOCUS" && selectedServer && (
          <motion.div
            key="layer-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="flex items-center gap-4 border-b border-border-soft pb-6">
              <button
                onClick={handleBackToServers}
                className="w-10 h-10 rounded-md border border-border-soft flex items-center justify-center hover:bg-surface-2 transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div>
                <h2 className="text-2xl font-display font-bold text-heading tracking-tight">
                  {selectedServer.name}
                </h2>
                <p className="text-sm text-primary font-mono font-bold tracking-widest">
                  {selectedServer.url}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-surface-1 border border-border-soft p-5 rounded-md shadow-sm">
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">
                    Server Metadata
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[11px] font-bold text-muted uppercase">
                        ID
                      </span>
                      <span className="text-[11px] font-mono font-bold text-heading">
                        {selectedServer.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[11px] font-bold text-muted uppercase">
                        Status
                      </span>
                      <span
                        className={`text-[11px] font-bold uppercase ${selectedServer.status === "online" ? "text-success" : "text-warning"}`}
                      >
                        {selectedServer.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-6">
                <h3 className="text-lg font-display font-bold text-heading tracking-tight flex items-center gap-3 px-1">
                  Active Incidents
                  <span className="px-2 py-0.5 bg-danger-soft text-danger text-[10px] rounded-full border border-danger-border">
                    {selectedServer.incidentCount}
                  </span>
                </h3>
                <div className="grid gap-4">
                  {allIncidents
                    .filter((i) => i.serverId === selectedServer.id)
                    .map((incident) => (
                      <IncidentObject
                        key={incident.id}
                        incident={incident}
                        onClick={() => handleIncidentClick(incident)}
                      />
                    ))}
                  {selectedServer.incidentCount === 0 && (
                    <div className="bg-surface-1 border border-dashed border-border-soft p-12 rounded-md text-center">
                      <span className="material-symbols-outlined text-muted text-4xl mb-3">
                        check_circle
                      </span>
                      <p className="text-muted font-medium">
                        No incidents detected on this instance.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {viewState === "INCIDENT_DETAIL" && selectedIncident && (
          <IncidentDetail
            incident={selectedIncident}
            onClose={handleBackToFocus}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
