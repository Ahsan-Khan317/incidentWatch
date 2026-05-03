export interface Server {
  id: string;
  name: string;
  url: string;
  status: "online" | "offline" | "degraded";
  incidentCount: number;
  region: string;
  lastPulse: string;
  tags: string[];
}

export interface TimelineEvent {
  id: string;
  type: "detection" | "assignment" | "status_change" | "comment";
  message: string;
  timestamp: string;
  user?: { name: string; avatar?: string };
}

export interface Incident {
  id: string;
  serverId: string;
  serviceId?: string | null;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "SEV1" | "SEV2" | "SEV3";
  type: string;
  status:
    | "Investigating"
    | "Monitoring"
    | "Resolved"
    | "Identified"
    | "Triggered";
  assignedTo?: string;
  assignedMemberIds: string[];
  assignedMemberNames: string[];
  assignedTeamIds: string[];
  tags: string[];
  description: string;
  stack?: string;
  createdAt: string;
  timeline: TimelineEvent[];
}
