import asyncHandler from "@/utils/Error/asyncHandler.js";
import { ApiResponse } from "@/utils/Error/ApiResponse.js";
import sdkService from "./sdk.service.js";

export const captureIncident = asyncHandler(async (req, res) => {
  const incident = await sdkService.processIncident(req.body, req.orgId);

  return res.status(201).json({ incidentId: incident._id }); // SDK expects incidentId field
});

export const handleHeartbeat = asyncHandler(async (req, res) => {
  const result = await sdkService.processHeartbeat(req.body, req.orgId, req.apiKeyDoc.key);

  return res.status(200).json(new ApiResponse(200, result, "Heartbeat processed"));
});

export const captureLogs = asyncHandler(async (req, res) => {
  const result = await sdkService.processLogs(
    req.body,
    req.orgId,
    req.apiKeyDoc.key,
    req.headers["x-iw-server-id"],
    req.headers["x-iw-environment"] || "development",
  );

  return res.status(202).json(new ApiResponse(202, result, "Logs accepted"));
});

export const verifyKey = asyncHandler(async (req, res) => {
  const serverId = req.headers["x-iw-server-id"];
  const environment = req.headers["x-iw-environment"] || "development";

  const result = await sdkService.verifyKey(req.orgId, serverId, environment);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "API Key is valid and service registered"));
});
