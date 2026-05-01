import logsService from "./logs.service.js";
import asyncHandler from "@/utils/Error/asyncHandler.js";
import { ApiResponse } from "@/utils/Error/ApiResponse.js";
import { ApiError } from "@/utils/Error/ApiError.js";

export const createLog = asyncHandler(async (req, res, next) => {
  const apiKeyHeader = req.headers["x-api-key"];
  const user = req.user;

  await logsService.createLog(req.body, { apiKeyHeader, user });

  return res.status(201).json({
    success: true,
    message: "Log created successfully",
  });
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
