export interface AssignmentRule {
  tagsRegex: string;
  teams: string[];
  members: string[];
}

export type ServiceStatus = "active" | "inactive" | "error";
export type Environment = "development" | "staging" | "production";

export interface Service {
  _id: string;
  name: string;
  description?: string;
  baseUrl?: string;
  organizationId: string;
  environment: Environment;
  lastHeartbeat: string;
  status: ServiceStatus;
  autoAssignEnabled: boolean;
  assignmentRules: AssignmentRule[];
  teams: string[];
  members: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  }[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  name: string;
  environment?: Environment;
  autoAssignEnabled?: boolean;
  assignmentRules?: AssignmentRule[];
  metadata?: Record<string, any>;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  status?: ServiceStatus;
}
