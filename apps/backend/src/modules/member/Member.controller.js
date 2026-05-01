import asyncHandler from "../../utils/Error/asyncHandler.js";
import { ApiResponse } from "../../utils/Error/ApiResponse.js";
import { memberService } from "./member.service.js";

// @desc    Get All Members
// @route   GET /api/v1/members
// @access  Admin Only
export const getAllMembers = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;
  const members = await memberService.getAllMembers(organizationId);

  return res.status(200).json(new ApiResponse(200, members, "Members fetched successfully"));
});

// @desc    Get Single Member
// @route   GET /api/v1/members/:id
// @access  Admin Only
export const getMemberById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const organizationId = req.user.organizationId;
  const member = await memberService.getMemberById(id, organizationId);

  return res.status(200).json(new ApiResponse(200, member, "Member fetched successfully"));
});

// @desc    Update Member Role
// @route   PUT /api/v1/members/:id
// @access  Admin Only
export const updateMemberRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const organizationId = req.user.organizationId;

  const member = await memberService.updateMemberRole(id, organizationId, role);

  return res.status(200).json(new ApiResponse(200, member, "Member role updated successfully"));
});

// @desc    Delete Member
// @route   DELETE /api/v1/members/:id
// @access  Admin Only
export const deleteMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const organizationId = req.user.organizationId;
  const currentUserId = req.user.id;

  await memberService.deleteMember(id, organizationId, currentUserId);

  return res.status(200).json(new ApiResponse(200, null, "Member deleted successfully"));
});
