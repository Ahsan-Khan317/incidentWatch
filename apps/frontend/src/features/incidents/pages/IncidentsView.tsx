import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Incident } from "../types";
import { IncidentObject } from "../components/IncidentObject";
import { IncidentDetail } from "../components/IncidentDetail";
import { useIncidents } from "../hooks/useIncidents";
import { useServiceStore } from "@/src/features/dashboard/store/service-store";
import Container from "@/src/components/dashboard/common/Container";
import IncidentsSkeleton from "../components/IncidentsSkeleton";

interface IncidentsViewProps {
  initialIncidentId?: string | null;
  onClearInitial?: () => void;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  initialIncidentId,
  onClearInitial,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null,
  );
  const { selectedServiceId, services } = useServiceStore();
  const { incidents: rawIncidents, isLoading } = useIncidents();

  // Map backend data to frontend Incident type
  const allIncidents: Incident[] = useMemo(() => {
    return rawIncidents.map((ri: any) => ({
      id: ri._id,
      serverId: ri.serverId || "Unknown",
      serviceId: ri.serviceId || null,
      title: ri.title,
      severity: ri.severity as any,
      type: ri.source || "Infrastructure",
      status:
        ri.status === "resolved"
          ? "Resolved"
          : ri.status === "acknowledged"
            ? "Identified"
            : "Investigating",
      assignedTo:
        ri.assignedMembers?.length > 0
          ? `${ri.assignedMembers.length} assigned`
          : "Unassigned",
      createdAt: new Date(ri.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      description: ri.description,
      timeline: (ri.timeline || []).map((t: any, idx: number) => ({
        id: String(idx),
        type: t.type || "detection",
        message: t.message || t.action || `Event: ${ri.title}`,
        timestamp: new Date(t.createdAt || ri.createdAt).toLocaleTimeString(),
      })),
    }));
  }, [rawIncidents]);

  // Filter incidents by the service selected in the sidebar
  const filteredIncidents = useMemo(() => {
    if (selectedServiceId === "all") return allIncidents;
    return allIncidents.filter((i: any) => i.serviceId === selectedServiceId);
  }, [allIncidents, selectedServiceId]);

  // Find selected service name for display
  const selectedServiceName = useMemo(() => {
    if (selectedServiceId === "all") return null;
    const svc = services.find(
      (s: any) => (s._id || s.id) === selectedServiceId,
    );
    return svc?.name || null;
  }, [services, selectedServiceId]);

  // Handle Initial Incident Selection (from overview click)
  useEffect(() => {
    if (initialIncidentId && allIncidents.length > 0) {
      const incident = allIncidents.find((i) => i.id === initialIncidentId);
      if (incident) {
        setSelectedIncident(incident);
        onClearInitial?.();
      }
    }
  }, [initialIncidentId, allIncidents, onClearInitial]);

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleBack = () => {
    setSelectedIncident(null);
  };

  if (isLoading) {
    return <IncidentsSkeleton />;
  }

  // Counts
  const openCount = filteredIncidents.filter(
    (i) => i.status !== "Resolved",
  ).length;
  const resolvedCount = filteredIncidents.filter(
    (i) => i.status === "Resolved",
  ).length;
  const criticalCount = filteredIncidents.filter(
    (i) => i.severity === "critical" || i.severity === "high",
  ).length;

  return (
    <Container className="space-y-6">
      <AnimatePresence mode="wait">
        {!selectedIncident ? (
          <motion.div
            key="incident-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="px-1">
              <h2 className="text-2xl font-display font-bold text-heading tracking-tight">
                Incidents
              </h2>
              <p className="text-sm text-muted font-medium mt-1 uppercase tracking-widest">
                {selectedServiceName
                  ? `Showing incidents for ${selectedServiceName}`
                  : `Showing all ${filteredIncidents.length} incident${filteredIncidents.length !== 1 ? "s" : ""} across all services`}
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface-1 border border-border-soft p-4 rounded-md">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">
                  Open
                </p>
                <p className="text-2xl font-display font-bold text-heading">
                  {openCount}
                </p>
              </div>
              <div className="bg-surface-1 border border-border-soft p-4 rounded-md">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">
                  Critical / High
                </p>
                <p className="text-2xl font-display font-bold text-danger">
                  {criticalCount}
                </p>
              </div>
              <div className="bg-surface-1 border border-border-soft p-4 rounded-md">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">
                  Resolved
                </p>
                <p className="text-2xl font-display font-bold text-success">
                  {resolvedCount}
                </p>
              </div>
            </div>

            {/* Incident List */}
            <div className="grid gap-4">
              {filteredIncidents.map((incident) => (
                <IncidentObject
                  key={incident.id}
                  incident={incident}
                  onClick={() => handleIncidentClick(incident)}
                />
              ))}
              {filteredIncidents.length === 0 && (
                <div className="bg-surface-1 border border-dashed border-border-soft p-16 rounded-md text-center">
                  <span className="material-symbols-outlined text-muted text-4xl mb-3 block">
                    check_circle
                  </span>
                  <p className="text-muted font-medium">
                    {selectedServiceName
                      ? `No incidents for ${selectedServiceName}.`
                      : "No incidents detected. All systems operational."}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <IncidentDetail incident={selectedIncident} onClose={handleBack} />
        )}
      </AnimatePresence>
    </Container>
  );
};
