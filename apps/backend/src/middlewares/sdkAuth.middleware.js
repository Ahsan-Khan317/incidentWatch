import apiKeyDao from "@/modules/apiKey/apiKey.dao.js";
import { ApiError } from "@/utils/Error/ApiError.js";
import asyncHandler from "@/utils/Error/asyncHandler.js";

export const sdkAuth = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers["x-iw-api-key"] || req.query.apiKey;

  if (!apiKey) {
    throw new ApiError(401, "API Key is required. Please provide it in 'X-IW-API-Key' header.");
  }

  const apiKeyDoc = await apiKeyDao.findOne({ key: apiKey, isActive: true });

  if (!apiKeyDoc) {
    throw new ApiError(401, "Invalid or inactive API Key.");
  }

  // Attach info to request
  req.orgId = apiKeyDoc.organizationId;
  req.apiKeyDoc = apiKeyDoc;

  next();
});
