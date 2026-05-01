import apiKeyService from "./apiKey.service.js";
import asyncHandler from "@/utils/Error/asyncHandler.js";
import { ApiResponse } from "@/utils/Error/ApiResponse.js";
import { ApiError } from "@/utils/Error/ApiError.js";

export const createApiKey = asyncHandler(async (req, res, next) => {
  const { name, expiresAt } = req.body;
  const organizationId = req.user.organizationId;

  const newApiKey = await apiKeyService.createApiKey(organizationId, name, expiresAt);

  return res.status(201).json(new ApiResponse(201, newApiKey, "API Key created successfully"));
});

export const getAllApiKeys = asyncHandler(async (req, res, next) => {
  const organizationId = req.user.organizationId;
  const apiKeys = await apiKeyService.getAllApiKeys(organizationId);

  return res.status(200).json(new ApiResponse(200, apiKeys, "API Keys fetched successfully"));
});

export const getApiKeyById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const organizationId = req.user.organizationId;

  const apiKey = await apiKeyService.getApiKeyById(id, organizationId);

  return res.status(200).json(new ApiResponse(200, apiKey, "API Key fetched successfully"));
});

export const regenerateApiKey = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const organizationId = req.user.organizationId;

  const updatedApiKey = await apiKeyService.regenerateApiKey(id, organizationId);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedApiKey, "API Key regenerated successfully"));
});

export const deleteApiKey = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const organizationId = req.user.organizationId;

  await apiKeyService.deleteApiKey(id, organizationId);

  return res.status(200).json(new ApiResponse(200, null, "API Key deleted successfully"));
});

export const toggleApiKeyStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const organizationId = req.user.organizationId;

  const updatedApiKey = await apiKeyService.toggleApiKeyStatus(id, organizationId);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedApiKey, "API Key status updated successfully"));
});
