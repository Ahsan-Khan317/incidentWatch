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
  title: string;
  severity: "critical" | "high" | "medium" | "low";
  type: string;
  status:
    | "Investigating"
    | "Monitoring"
    | "Resolved"
    | "Identified"
    | "Triggered";
  assignedTo?: string;
  description: string;
  createdAt: string;
  timeline: TimelineEvent[];
}
