import apiKeyService from "./apiKey.service.js";
import asyncHandler from "@/utils/Error/asyncHandler.js";
import { ApiResponse } from "@/utils/Error/ApiResponse.js";
import { ApiError } from "@/utils/Error/ApiError.js";

export const createApiKey = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const orgId = req.user.orgid;

  const newApiKey = await apiKeyService.createApiKey(orgId, name);

  return res.status(201).json(new ApiResponse(201, newApiKey, "API Key created successfully"));
});

export const getAllApiKeys = asyncHandler(async (req, res, next) => {
  const orgId = req.user.orgid;
  const apiKeys = await apiKeyService.getAllApiKeys(orgId);

  return res.status(200).json(new ApiResponse(200, apiKeys, "API Keys fetched successfully"));
});

export const getApiKeyById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const orgId = req.user.orgid;

  const apiKey = await apiKeyService.getApiKeyById(id, orgId);

  return res.status(200).json(new ApiResponse(200, apiKey, "API Key fetched successfully"));
});

export const regenerateApiKey = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const orgId = req.user.orgid;

  const updatedApiKey = await apiKeyService.regenerateApiKey(id, orgId);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedApiKey, "API Key regenerated successfully"));
});

export const deleteApiKey = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const orgId = req.user.orgid;

  await apiKeyService.deleteApiKey(id, orgId);

  return res.status(200).json(new ApiResponse(200, null, "API Key deleted successfully"));
});
