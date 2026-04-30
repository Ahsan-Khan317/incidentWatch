import statusService from "./status.service.js";
import asyncHandler from "@/utils/Error/asyncHandler.js";
import { ApiResponse } from "@/utils/Error/ApiResponse.js";
import { ApiError } from "@/utils/Error/ApiError.js";

export const createStatus = asyncHandler(async (req, res, next) => {
  const { title, description, severity, status } = req.body;
  const createdBy = req.user.id;
  const orgId = req.user.orgid;

  if (!title) {
    return next(new ApiError(400, "Title is required"));
  }

  const newStatus = await statusService.createStatus({
    title,
    description,
    severity,
    status,
    createdBy,
    orgId,
  });

  return res.status(201).json(new ApiResponse(201, newStatus, "Status created successfully"));
});

export const getAllStatus = asyncHandler(async (req, res, next) => {
  const orgId = req.user.orgid;
  const statuses = await statusService.getAllStatus({ orgId });

  return res.status(200).json(new ApiResponse(200, statuses, "Statuses fetched successfully"));
});

export const getStatusById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const status = await statusService.getStatusById(id);

  // Check if status belongs to the same org
  if (status.orgId.toString() !== req.user.orgid.toString()) {
    return next(new ApiError(403, "Unauthorized to access this status"));
  }

  return res.status(200).json(new ApiResponse(200, status, "Status fetched successfully"));
});

export const updateStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  // Check if status belongs to the same org before update
  const existingStatus = await statusService.getStatusById(id);
  if (existingStatus.orgId.toString() !== req.user.orgid.toString()) {
    return next(new ApiError(403, "Unauthorized to update this status"));
  }

  const updatedStatus = await statusService.updateStatus(id, updateData);

  return res.status(200).json(new ApiResponse(200, updatedStatus, "Status updated successfully"));
});

export const deleteStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Check if status belongs to the same org before delete
  const existingStatus = await statusService.getStatusById(id);
  if (existingStatus.orgId.toString() !== req.user.orgid.toString()) {
    return next(new ApiError(403, "Unauthorized to delete this status"));
  }

  await statusService.deleteStatus(id);

  return res.status(200).json(new ApiResponse(200, null, "Status deleted successfully"));
});
