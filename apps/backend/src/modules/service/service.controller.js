import asyncHandler from "@/utils/Error/asyncHandler.js";
import { ApiResponse } from "@/utils/Error/ApiResponse.js";
import serviceService from "./service.service.js";

export const getServices = asyncHandler(async (req, res) => {
  const orgId = req.user.organizationId || req.user.orgid;
  const services = await serviceService.getServicesByOrg(orgId);

  return res.status(200).json(new ApiResponse(200, services, "Services retrieved successfully"));
});

export const getServiceDetails = asyncHandler(async (req, res) => {
  const orgId = req.user.organizationId || req.user.orgid;
  const { name } = req.params;

  const service = await serviceService.getServiceByName(orgId, name);

  return res.status(200).json(new ApiResponse(200, service, "Service details retrieved"));
});

export const createService = asyncHandler(async (req, res) => {
  const orgId = req.user.organizationId || req.user.orgid;
  const service = await serviceService.createService(orgId, req.body);

  return res.status(201).json(new ApiResponse(201, service, "Service created successfully"));
});

export const updateService = asyncHandler(async (req, res) => {
  const orgId = req.user.organizationId || req.user.orgid;
  const { id } = req.params;

  const service = await serviceService.updateService(id, orgId, req.body);

  return res.status(200).json(new ApiResponse(200, service, "Service updated successfully"));
});

export const deleteService = asyncHandler(async (req, res) => {
  const orgId = req.user.organizationId || req.user.orgid;
  const { id } = req.params;

  await serviceService.deleteService(id, orgId);

  return res.status(200).json(new ApiResponse(200, null, "Service deleted successfully"));
});
