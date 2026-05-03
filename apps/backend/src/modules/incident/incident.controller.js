import asyncHandler from "../../utils/Error/asyncHandler.js";

import { ApiResponse } from "../../utils/Error/ApiResponse.js";

import { incidentService } from "./incident.service.js";

export const createIncident = asyncHandler(async (req, res) => {
  const incident = await incidentService.createIncident({
    ...req.body,
  });

  return res.status(201).json(new ApiResponse(201, incident, "Incident created successfully"));
});

export const assignIncident = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const incident = await incidentService.assignIncident({
    incidentId: id,
    assignedTo: req.body.assignedTo,
  });

  return res.status(200).json(new ApiResponse(200, incident, "Incident assigned successfully"));
});

export const updateIncidentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const incident = await incidentService.updateStatus({
    incidentId: id,
    status: req.body.status,
    userId: req.user.id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, incident, "Incident status updated successfully"));
});

export const resolveIncident = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const incident = await incidentService.resolveIncident({
    incidentId: id,
    userId: req.user.id,
  });

  return res.status(200).json(new ApiResponse(200, incident, "Incident resolved successfully"));
});

export const addIncidentLog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const incident = await incidentService.addLog({
    incidentId: id,
    log: req.body.log,
  });

  return res.status(200).json(new ApiResponse(200, incident, "Log added successfully"));
});

export const getIncident = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const incident = await incidentService.getIncident({
    incidentId: id,
  });

  return res.status(200).json(new ApiResponse(200, incident, "Incident fetched successfully"));
});

export const getAllIncidents = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;

  const incidents = await incidentService.getAllIncidents({ organizationId });

  return res.status(200).json(new ApiResponse(200, incidents, "Incidents fetched successfully"));
});
