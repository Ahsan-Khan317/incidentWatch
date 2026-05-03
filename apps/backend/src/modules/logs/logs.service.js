import apiKeyDao from "../apiKey/apiKey.dao.js";
import { ApiError } from "@/utils/Error/ApiError.js";
import { publishLogEvent, getRecentLogs } from "@/stream/bus.js";
import { randomUUID } from "crypto";

class LogsService {
  async createLog(body, auth) {
    const { message, title, level, severity, service, tags, context, breadcrumbs, meta } = body;
    const { apiKeyHeader, user } = auth;

    // 1. Resolve orgId and apiKey
    let orgId;
    let apiKey = "none";

    if (apiKeyHeader) {
      const apiKeyDoc = await apiKeyDao.findOne({ key: apiKeyHeader, isActive: true });
      if (!apiKeyDoc) {
        throw new ApiError(401, "Invalid or inactive API Key");
      }
      orgId = apiKeyDoc.organizationId;
      apiKey = apiKeyHeader;
    } else if (user) {
      orgId = user.organizationId || user.orgid;
      apiKey = "jwt_auth";
    }

    if (!orgId) {
      throw new ApiError(401, "Authentication required (API Key or JWT)");
    }

    // 2. Normalize data
    const normalizedMessage = message || title;

    // Severity mapping: SEV1 -> error, SEV2 -> warn, SEV3 -> info
    const sevMap = {
      SEV1: "error",
      SEV2: "warn",
      SEV3: "info",
    };

    // Determine level: prioritize mapping from severity, then mapping from level, then raw values
    const normalizedLevel = sevMap[severity] || sevMap[level] || level || severity || "info";

    // Extract service: SDK uses context.service, legacy uses body.service
    const resolvedService = context?.service || service || "unknown";

    // Metadata construction
    const metadata = {
      tags: tags || [],
      context: context || {},
      breadcrumbs: breadcrumbs || [],
      ...meta, // Backward compatibility: merge existing meta if present
    };

    const normalizedLogEvent = {
      id: randomUUID(),
      message: normalizedMessage,
      level: normalizedLevel.toLowerCase(),
      severity: severity || null,
      orgId: String(orgId),
      apiKey,
      service: resolvedService,
      metadata,
      timestamp: new Date().toISOString(),
      source: "logs-api",
      deliveryMode:
        body.deliveryMode || (normalizedLevel.toLowerCase() === "error" ? "critical" : "normal"),
    };

    // No long-term write on the hot path: push into stream bus.
    await publishLogEvent(normalizedLogEvent);

    return normalizedLogEvent;
  }

  async getAllLogs(filter) {
    const { orgId, level, service } = filter;

    // Fetch from the sharded org-specific stream for performance and isolation
    const recentLogs = await getRecentLogs(1000, orgId);

    // Apply in-memory filtering
    return recentLogs.filter((log) => {
      // 1. Organization Filter
      if (orgId && String(log.orgId) !== String(orgId)) return false;

      // 2. Level Filter
      if (level && String(log.level).toLowerCase() !== String(level).toLowerCase()) return false;

      // 3. Service Filter
      if (service) {
        const logService = String(log.service || "unknown").toLowerCase();
        const filterService = String(service).toLowerCase();
        if (logService !== filterService) return false;
      }

      return true;
    });
  }

  async getLogById(id, orgId) {
    const recentLogs = await getRecentLogs(1000, orgId);
    const log = recentLogs.find(
      (l) => (l.id === id || l.streamId === id) && String(l.orgId) === String(orgId),
    );

    if (!log) {
      throw new ApiError(404, "Log not found in recent stream buffer");
    }

    return log;
  }
}

export default new LogsService();
