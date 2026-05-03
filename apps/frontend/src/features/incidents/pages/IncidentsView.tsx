import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Incident, TimelineEvent } from "../types";
import { IncidentObject } from "../components/IncidentObject";
import { IncidentDetail } from "../components/IncidentDetail";
import { useIncidents } from "../hooks/useIncidents";
import { useServiceStore } from "@/src/features/dashboard/store/service-store";
import { useMembers } from "../../members/hooks/useMembers";
import Container from "@/src/components/dashboard/common/Container";
import IncidentsSkeleton from "../components/IncidentsSkeleton";

interface IncidentsViewProps {
  initialIncidentId?: string | null;
  onClearInitial?: () => void;
}

type BackendIdValue = string | { _id?: string } | null | undefined;

interface BackendTimelineEvent {
  type?: TimelineEvent["type"];
  message?: string;
  action?: string;
  time?: string;
  createdAt?: string;
}

interface BackendIncident {
  _id: string;
  serverId?: string;
  serviceId?: BackendIdValue;
  title: string;
  severity?: string;
  source?: string;
  status?: string;
  assignedMembers?: BackendIdValue[];
  assignedTeams?: BackendIdValue[];
  tags?: string[];
  createdAt?: string;
  description?: string;
  stack?: string;
  timeline?: BackendTimelineEvent[];
}

interface ServiceOption {
  _id?: string;
  id?: string;
  name?: string;
}

export const IncidentsView: React.FC<IncidentsViewProps> = ({
  initialIncidentId,
  onClearInitial,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(
    null,
  );
  const { selectedServiceId, services } = useServiceStore();
  const { incidents: rawIncidents, isLoading } = useIncidents();
  const { members } = useMembers();

  const memberNameByUserId = useMemo(() => {
    return new Map(
      members
        .filter((member) => member.userId)
        .map((member) => [member.userId as string, member.name]),
    );
  }, [members]);

  // Map backend data to frontend Incident type
  const allIncidents: Incident[] = useMemo(() => {
    return (rawIncidents as BackendIncident[]).map((ri) => {
      const assignedMemberIds = normalizeIds(ri.assignedMembers);
      const assignedTeamIds = normalizeIds(ri.assignedTeams);
      const assignedMemberNames = assignedMemberIds
        .map((id) => memberNameByUserId.get(id))
        .filter(Boolean) as string[];
      const assignedTo = formatAssigneeLabel(
        assignedMemberIds,
        assignedMemberNames,
        assignedTeamIds,
      );

      return {
        id: ri._id,
        displayId: `INC-${ri._id.substring(ri._id.length - 6).toUpperCase()}`,
        serverId: ri.serverId || "Unknown",
        serviceId: normalizeId(ri.serviceId),
        title: ri.title,
        severity: normalizeSeverity(ri.severity),
        type: ri.source || "Infrastructure",
        status:
          ri.status === "resolved"
            ? "Resolved"
            : ri.status === "acknowledged"
              ? "Identified"
              : "Investigating",
        assignedTo,
        assignedMemberIds,
        assignedMemberNames,
        assignedTeamIds,
        tags: ri.tags || [],
        createdAt: formatTime(ri.createdAt),
        description: ri.description || ri.title,
        stack: ri.stack,
        timeline: (ri.timeline || []).map((t, idx: number) => ({
          id: String(idx),
          type: inferTimelineType(t.type, t.action || t.message),
          message: t.message || t.action || `Event: ${ri.title}`,
          timestamp: formatTime(t.time || t.createdAt || ri.createdAt),
        })),
      };
    });
  }, [rawIncidents, memberNameByUserId]);

  // Filter incidents by the service selected in the sidebar
  const filteredIncidents = useMemo(() => {
    if (selectedServiceId === "all") return allIncidents;
    return allIncidents.filter((i) => i.serviceId === selectedServiceId);
  }, [allIncidents, selectedServiceId]);

  // Find selected service name for display
  const selectedServiceName = useMemo(() => {
    if (selectedServiceId === "all") return null;
    const svc = (services as ServiceOption[]).find(
      (s) => (s._id || s.id) === selectedServiceId,
    );
    return svc?.name || null;
  }, [services, selectedServiceId]);

  const selectedIncident = useMemo(() => {
    const id = selectedIncidentId || initialIncidentId;
    if (!id) return null;
    return allIncidents.find((incident) => incident.id === id) || null;
  }, [allIncidents, initialIncidentId, selectedIncidentId]);

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncidentId(incident.id);
    onClearInitial?.();
  };

  const handleBack = () => {
    setSelectedIncidentId(null);
    onClearInitial?.();
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
              <h2 className="text-4xl font-black text-heading tracking-tighter uppercase">
                Active Incidents
              </h2>

              <p className="text-[10px] text-muted font-bold mt-2 uppercase tracking-[0.3em] opacity-70">
                {selectedServiceName
                  ? `Infrastructure context: ${selectedServiceName}`
                  : `Tactical overview: ${filteredIncidents.length} active threads`}
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="bg-surface-1 border border-border/50 p-4 rounded-none flex items-center justify-between sm:block">
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] sm:mb-2">
                  Open
                </p>
                <p className="text-2xl font-black text-heading tracking-tighter">
                  {openCount}
                </p>
              </div>
              <div className="bg-surface-1 border border-border/50 p-4 rounded-none flex items-center justify-between sm:block">
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] sm:mb-2">
                  Critical / High
                </p>
                <p className="text-2xl font-black text-danger tracking-tighter">
                  {criticalCount}
                </p>
              </div>
              <div className="bg-surface-1 border border-border/50 p-4 rounded-none flex items-center justify-between sm:block">
                <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] sm:mb-2">
                  Resolved
                </p>
                <p className="text-2xl font-black text-success tracking-tighter">
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

const normalizeId = (value: BackendIdValue): string | null => {
  if (!value) return null;
  if (typeof value === "object") return value._id ? String(value._id) : null;
  return String(value);
};

const normalizeIds = (values: BackendIdValue[] = []): string[] => {
  return values.map(normalizeId).filter(Boolean) as string[];
};

const normalizeSeverity = (severity?: string): Incident["severity"] => {
  if (severity === "SEV1") return "critical";
  if (severity === "SEV2") return "high";
  if (severity === "SEV3") return "medium";
  return (severity || "low") as Incident["severity"];
};

const formatTime = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAssigneeLabel = (
  memberIds: string[],
  memberNames: string[],
  teamIds: string[],
) => {
  if (memberNames.length === 1 && teamIds.length === 0) return memberNames[0];
  if (memberNames.length > 1 && teamIds.length === 0) {
    return `${memberNames[0]} +${memberNames.length - 1}`;
  }
  if (memberIds.length > 0 || teamIds.length > 0) {
    const memberCount = memberIds.length;
    const teamCount = teamIds.length;
    return `${memberCount} member${memberCount === 1 ? "" : "s"}${
      teamCount > 0 ? `, ${teamCount} team${teamCount === 1 ? "" : "s"}` : ""
    }`;
  }
  return "Unassigned";
};

const inferTimelineType = (
  type: TimelineEvent["type"] | undefined,
  message: string = "",
): TimelineEvent["type"] => {
  if (type) return type;
  const normalizedMessage = message.toLowerCase();
  if (normalizedMessage.includes("assign")) return "assignment";
  if (
    normalizedMessage.includes("status") ||
    normalizedMessage.includes("resolved")
  ) {
    return "status_change";
  }
  return "detection";
};
