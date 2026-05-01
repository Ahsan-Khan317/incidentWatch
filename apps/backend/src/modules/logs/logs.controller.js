import logsService from "./logs.service.js";
import apiKeyDao from "../apiKey/apiKey.dao.js";
import asyncHandler from "@/utils/Error/asyncHandler.js";
import { ApiResponse } from "@/utils/Error/ApiResponse.js";
import { ApiError } from "@/utils/Error/ApiError.js";

export const createLog = asyncHandler(async (req, res, next) => {
  const { message, level, service, meta } = req.body;
  const apiKeyHeader = req.headers["x-api-key"];

  let orgId;
  let usedApiKey = "none";

  if (apiKeyHeader) {
    // Validate API Key
    const apiKeyDoc = await apiKeyDao.findOne({ key: apiKeyHeader, isActive: true });
    if (!apiKeyDoc) {
      return next(new ApiError(401, "Invalid or inactive API Key"));
    }
    orgId = apiKeyDoc.organizationId;
    usedApiKey = apiKeyHeader;
  } else if (req.user) {
    // Fallback to JWT
    orgId = req.user.organizationId || req.user.orgid;
    usedApiKey = "jwt_auth";
  }

  if (!orgId) {
    return next(new ApiError(401, "Authentication required (API Key or JWT)"));
  }

  const log = await logsService.createLog({
    message,
    level,
    service,
    orgId,
    apiKey: usedApiKey,
    meta: meta || {},
  });

  return res.status(201).json(new ApiResponse(201, log, "Log created successfully"));
});

export const getAllLogs = asyncHandler(async (req, res, next) => {
  const orgId = req.user.organizationId || req.user.orgid;
  const { level, service } = req.query;

  const filter = { orgId };
  if (level) filter.level = level;
  if (service) filter.service = service;

  const logs = await logsService.getAllLogs(filter);

  return res.status(200).json(new ApiResponse(200, logs, "Logs fetched successfully"));
});

export const getLogById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const orgId = req.user.organizationId || req.user.orgid;

  const log = await logsService.getLogById(id, orgId);

  return res.status(200).json(new ApiResponse(200, log, "Log fetched successfully"));
});
