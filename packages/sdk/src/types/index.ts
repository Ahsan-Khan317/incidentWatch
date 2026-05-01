export type Severity = "SEV1" | "SEV2" | "SEV3";

export interface UserInfo {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
}

export interface Scope {
  tags: string[];
  context: Record<string, unknown>;
  user?: UserInfo;
}

export interface SDKStatus {
  initialized: boolean;
  version: string;
  integrations: {
    express: boolean;
    axios: boolean;
    fetch: boolean;
    console: boolean;
  };
  memoryMonitor: boolean;
  heartbeat: boolean;
  circuitBreakerOpen: boolean;
  config: {
    environment: string;
    serverId: string;
    appName: string;
    slowThresholdMs: number;
    debug: boolean;
  };
}

export type IntegrationName = "express" | "axios" | "fetch" | "console";

export interface TransportConfig {
  timeout: number;
  retries: number;
  retryDelay: number;
}

export interface LoggerConfig {
  level: "error" | "warn" | "info" | "http" | "debug";
  prettyPrint: boolean;
  filePath: string | null;
}

export interface IntegrationsConfig {
  express: boolean;
  axios: boolean;
  fetch: boolean;
  console: boolean;
}

export interface SDKConfig {
  apiKey: string;
  serverId: string;
  platformUrl: string;
  environment: string;
  release?: string;
  appName: string;
  slowThresholdMs: number;
  breadcrumbLimit: number;
  heartbeatIntervalMs: number;
  flushIntervalMs: number;
  debug: boolean;
  ignoreErrors: Array<string | RegExp>;
  memoryAlertThresholdMb: number;
  heapAlertThresholdPct: number;
  integrations: IntegrationsConfig;
  logger: LoggerConfig;
  transport: TransportConfig;
}

export type UserConfig = Partial<SDKConfig> & {
  apiKey: string;
  serverId: string;
};

export interface Breadcrumb {
  category: string;
  data: Record<string, unknown>;
  level: "info" | "warn" | "error" | "debug";
  timestamp: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  tags: string[];
  context: Record<string, unknown>;
  source: "sdk-auto" | "sdk-manual";
  breadcrumbs: Breadcrumb[];
  serverId: string;
  appName: string;
  environment: string;
  release?: string;
  timestamp: string;
  runtime: {
    node: string;
    platform: string;
    pid: number;
    uptime: number;
    memory: NodeJS.MemoryUsage;
  };
}

export interface IncidentData {
  title: string;
  severity?: Severity;
  description?: string;
  tags?: string[];
  context?: Record<string, unknown>;
}

export interface CaptureErrorOptions {
  severity?: Severity;
  tags?: string[];
  context?: Record<string, unknown>;
  title?: string;
  source?: "sdk-auto" | "sdk-manual";
}
