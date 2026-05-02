import asyncHandler from "@/utils/Error/asyncHandler.js";
import { ApiResponse } from "@/utils/Error/ApiResponse.js";
import teamService from "./team.service.js";

export const getTeams = asyncHandler(async (req, res) => {
  const orgId = req.user.organizationId || req.user.orgid;
  const teams = await teamService.getTeamsByOrg(orgId);
  return res.status(200).json(new ApiResponse(200, teams, "Teams retrieved"));
});

export const createTeam = asyncHandler(async (req, res) => {
  const orgId = req.user.organizationId || req.user.orgid;
  const team = await teamService.createTeam(orgId, req.body);
  return res.status(201).json(new ApiResponse(201, team, "Team created"));
});

export const updateTeam = asyncHandler(async (req, res) => {
  const orgId = req.user.organizationId || req.user.orgid;
  const { id } = req.params;
  const team = await teamService.updateTeam(id, orgId, req.body);
  return res.status(200).json(new ApiResponse(200, team, "Team updated"));
});

export const deleteTeam = asyncHandler(async (req, res) => {
  const orgId = req.user.organizationId || req.user.orgid;
  const { id } = req.params;
  await teamService.deleteTeam(id, orgId);
  return res.status(200).json(new ApiResponse(200, null, "Team deleted"));
});
