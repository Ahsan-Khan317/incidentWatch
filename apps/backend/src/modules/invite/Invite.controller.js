import asyncHandler from "../../utils/Error/asyncHandler.js";
import { ApiResponse } from "../../utils/Error/ApiResponse.js";
import { ApiError } from "../../utils/Error/ApiError.js";
import { inviteService } from "./invite.service.js";
import { ENV } from "@/configs/env.config.js";

// @desc    Invite Member
// @route   POST /api/invite
// @access  Admin Only
export const inviteMember = asyncHandler(async (req, res) => {
  const { email, role, expertise, tier, avatarColor } = req.body;
  const organizationId = req.user.organizationId;

  if (!organizationId) {
    console.error("[INVITE] organizationId is undefined in req.user. User context:", req.user);
    throw new ApiError(403, "Organization context missing. Please re-login.");
  }

  console.log("ORG ID:", organizationId);

  const invite = await inviteService.inviteMember({
    email,
    role,
    organizationId,
    expertise,
    tier,
    avatarColor,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        inviteId: invite._id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
      },
      "Invitation sent successfully",
    ),
  );
});

// @desc    Accept Invite
// @route   POST /api/accept-invite
// @access  Public
export const acceptInvite = asyncHandler(async (req, res) => {
  const { token } = req.query;

  const result = await inviteService.acceptInvite({ token });

  res.redirect(`${ENV.FRONTEND_URL}/login`);
  return;
});

// @desc    Get All Invites
// @route   GET /api/invite
// @access  Admin Only
export const getInvites = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;
  const invites = await inviteService.getInvitesByOrg(organizationId);

  return res.status(200).json(new ApiResponse(200, invites, "Invitations fetched successfully"));
});

// @desc    Delete/Revoke Invite
// @route   DELETE /api/invite/:id
// @access  Admin Only
export const deleteInvite = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await inviteService.deleteInvite(id);

  return res.status(200).json(new ApiResponse(200, null, "Invitation revoked successfully"));
});
