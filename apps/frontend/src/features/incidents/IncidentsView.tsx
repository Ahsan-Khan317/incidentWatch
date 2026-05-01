import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Incident } from "./types";
import { ServerCard } from "./components/ServerCard";
import { IncidentObject } from "./components/IncidentObject";
import { IncidentDetail } from "./components/IncidentDetail";
import { useIncidents } from "./hooks/useIncidents";

type ViewState = "SERVERS" | "SERVER_FOCUS" | "INCIDENT_DETAIL";

interface IncidentsViewProps {
  initialIncidentId?: string | null;
  onClearInitial?: () => void;
}

// Mock servers for now (until Instance module is built)
const MOCK_SERVERS: Server[] = [
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

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  initialIncidentId,
  onClearInitial,
}) => {
  const [viewState, setViewState] = useState<ViewState>("SERVERS");
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );

  const { incidents: rawIncidents, isLoading } = useIncidents();

  const servers = MOCK_SERVERS;

  // Map backend "Status" to frontend "Incident"
  const allIncidents: Incident[] = useMemo(() => {
    return rawIncidents.map((ri: any) => ({
      id: ri._id,
      serverId: ri.serverId || "srv-002", // Fallback for existing data without serverId
      title: ri.title,
      severity: ri.severity as any,
      type: "Infrastructure",
      status: ri.status === "resolved" ? "Resolved" : "Investigating",
      assignedTo: "Team Alpha",
      createdAt: new Date(ri.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      description: ri.description,
      timeline: [
        {
          id: "1",
          type: "detection",
          message: `Detected: ${ri.title}`,
          timestamp: new Date(ri.createdAt).toLocaleTimeString(),
        },
      ],
    }));
  }, [rawIncidents]);

  // Handle Initial Incident Selection
  React.useEffect(() => {
    if (initialIncidentId && allIncidents.length > 0) {
      const incident = allIncidents.find((i) => i.id === initialIncidentId);
      if (incident) {
        setSelectedIncident(incident);

        // Also find and select the server so "Back" works as expected
        const parentServer = servers.find((s) => s.id === incident.serverId);
        if (parentServer) {
          setSelectedServer(parentServer);
        }

        setViewState("INCIDENT_DETAIL");
        // Clear the initial ID from parent state once we've consumed it
        onClearInitial?.();
      }
    }
  }, [initialIncidentId, allIncidents, servers, onClearInitial]);

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
    if (selectedServer) {
      setViewState("SERVER_FOCUS");
    } else {
      setViewState("SERVERS");
    }
  };

  if (isLoading && viewState === "SERVERS") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8 overflow-y-auto h-[calc(100vh-4rem)] custom-scrollbar">
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
                  server={{
                    ...server,
                    incidentCount: allIncidents.filter(
                      (i) => i.serverId === server.id,
                    ).length,
                  }}
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
                    {
                      allIncidents.filter(
                        (i) => i.serverId === selectedServer.id,
                      ).length
                    }
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
                  {allIncidents.filter((i) => i.serverId === selectedServer.id)
                    .length === 0 && (
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
