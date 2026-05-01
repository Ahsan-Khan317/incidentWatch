import { v4 as uuidv4 } from "uuid";
import {
  SDKConfig,
  Incident,
  IncidentData,
  CaptureErrorOptions,
  Breadcrumb,
} from "../types";
import { BreadcrumbManager } from "./breadcrumb-manager";

export class IncidentBuilder {
  constructor(
    private config: SDKConfig,
    private breadcrumbs: BreadcrumbManager,
  ) {}

  /** Error object se incident banao */
  fromError(error: Error, options: CaptureErrorOptions = {}): Incident {
    return this._build({
      title: options.title || `[${error.name || "Error"}] ${error.message}`,
      severity: options.severity || "SEV2",
      description: this._formatError(error),
      tags: options.tags || [],
      context: options.context || {},
      source: options.source || "sdk-auto",
    });
  }

  /** Manual incident (captureIncident) banao */
  fromManual(data: IncidentData): Incident {
    return this._build({
      title: data.title,
      severity: data.severity || "SEV2",
      description: data.description || "",
      tags: data.tags || [],
      context: data.context || {},
      source: "sdk-manual",
    });
  }

  private _build(data: {
    title: string;
    severity: Incident["severity"];
    description: string;
    tags: string[];
    context: Record<string, unknown>;
    source: Incident["source"];
  }): Incident {
    return {
      id: uuidv4(),
      title: data.title,
      severity: data.severity,
      description: data.description,
      tags: data.tags,
      context: data.context,
      source: data.source,
      breadcrumbs: this.breadcrumbs.getAll(),
      serverId: this.config.serverId,
      appName: this.config.appName,
      environment: this.config.environment,
      release: this.config.release,
      timestamp: new Date().toISOString(),
      runtime: {
        node: process.version,
        platform: process.platform,
        pid: process.pid,
        uptime: Math.round(process.uptime()),
        memory: process.memoryUsage(),
      },
    };
  }

  private _formatError(error: Error & { cause?: unknown }): string {
    const parts = [`${error.name || "Error"}: ${error.message}`];
    if (error.stack) {
      parts.push("\nStack trace:");
      parts.push(error.stack);
    }
    if (error.cause) {
      parts.push(`\nCaused by: ${error.cause}`);
    }
    return parts.join("\n");
  }
}
