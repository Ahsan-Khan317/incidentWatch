import asyncHandler from "../../utils/Error/asyncHandler.js";
import { ApiResponse } from "../../utils/Error/ApiResponse.js";
import { ApiError } from "../../utils/Error/ApiError.js";
import { inviteService } from "./invite.service.js";

// @desc    Invite Member
// @route   POST /api/invite
// @access  Admin Only
export const inviteMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const organizationId = req.user.organizationId;

  if (!organizationId) {
    console.error("[INVITE] organizationId is undefined in req.user. User context:", req.user);
    throw new ApiError(403, "Organization context missing. Please re-login.");
  }

  console.log("ORG ID:", organizationId);

  const invite = await inviteService.inviteMember({ email, role, organizationId });

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
  const { token, name, password } = req.body;

  const result = await inviteService.acceptInvite({ token, name, password });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        userId: result.user._id,
        email: result.user.email,
        organizationId: result.user.organizationId,
      },
      "Invitation accepted successfully",
    ),
  );
});
