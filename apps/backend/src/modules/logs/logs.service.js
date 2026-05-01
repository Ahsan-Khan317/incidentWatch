import logsDao from "./logs.dao.js";
import apiKeyDao from "../apiKey/apiKey.dao.js";
import { ApiError } from "@/utils/Error/ApiError.js";

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

    // 3. Call DAO
    return await logsDao.create({
      message: normalizedMessage,
      level: normalizedLevel.toLowerCase(),
      orgId,
      apiKey,
      service: resolvedService,
      metadata,
    });
  }

  async getAllLogs(filter) {
    return await logsDao.findAll(filter);
  }

  async getLogById(id, orgId) {
    const log = await logsDao.findById(id);
    if (!log) {
      throw new ApiError(404, "Log not found");
    }
    if (log.orgId.toString() !== orgId.toString()) {
      throw new ApiError(403, "Unauthorized access to this log");
    }
    return log;
  }
}

export default new LogsService();
