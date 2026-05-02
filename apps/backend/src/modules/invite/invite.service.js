import { ApiError } from "../../utils/Error/ApiError.js";
import { inviteDao } from "./invite.dao.js";
import { authDao } from "../auth/auth.dao.js";
import { generateInviteToken } from "../../utils/generateToken.js";
import sendEmail from "../../services/Email/sendEmail.js";
import { getInviteEmailTemplate } from "../../services/Email/Email_msg.js";
import crypto from "crypto";

export const inviteService = {
  inviteMember: async ({ email, role, organizationId }) => {
    console.log("INVITE SERVICE ORG ID:", organizationId);
    // 1. Check if user already exists in this organization
    const existingUser = await authDao.findUserByEmailAndOrganizationId(email, organizationId);
    if (existingUser) {
      const userObj = existingUser.toObject();
      const userOrgId = userObj.organizationId || userObj.orgid;
      if (userOrgId && userOrgId.toString() === organizationId.toString()) {
        throw new ApiError(400, "User already exists in this organization");
      }
    }

    // 2. Prevent duplicate active invites
    const existingInvite = await inviteDao.findInviteByEmailAndOrganizationId(
      email,
      organizationId,
    );
    if (existingInvite && existingInvite.expiresAt > new Date()) {
      throw new ApiError(400, "An active invitation already exists for this email");
    }

    // 3. Generate token
    const inviteToken = generateInviteToken();

    // 4. Create invite record
    const invite = await inviteDao.createInvite({
      email,
      organizationId: organizationId,
      role: role || "viewer",
      inviteToken,
    });

    // 5. Send email
    const organization = await authDao.findOrganizationById(organizationId);
    const html = getInviteEmailTemplate(inviteToken, organization.organizationName, email);

    try {
      await sendEmail({
        to: email,
        subject: `Invitation to join ${organization.organizationName}`,
        html,
      });
    } catch (error) {
      console.error("[INVITE] Failed to send email:", error.message);
      // We keep the invite record, but inform the user
      throw new ApiError(500, "Invitation created but failed to send email");
    }

    return invite;
  },

  acceptInvite: async ({ token }) => {
    // 1. Validate token
    const invite = await inviteDao.findInviteByToken(token);
    if (!invite) {
      throw new ApiError(404, "Invalid or expired invitation token");
    }

    if (invite.isAccepted) {
      throw new ApiError(400, "Invitation has already been accepted");
    }

    if (invite.expiresAt < new Date()) {
      throw new ApiError(400, "Invitation has expired");
    }

    // 2. Check if user already exists
    let user = await authDao.findUserByEmailAndOrganizationId(invite.email, invite.organizationId);

    if (!user) {
      // 3. Create user if not exists
      // Note: In a real scenario, we might want the user to provide their name and password
      // For now, following "Create user or attach to organization"
      // If we create a user, they might need to set a password later or we generate a random one
      user = await authDao.createUser({
        name: invite.email.split("@")[0], // Default name from email
        email: invite.email,
        password: crypto.randomBytes(16).toString("hex"), // Random password
        role: invite.role,
        organizationId: invite.organizationId,
        orgid: invite.organizationId, // Set both for backward compatibility
        isVerified: true, // They accepted via email, so verified
        isActive: true,
      });
    } else {
      // 4. Attach to organization (already checked in inviteMember, but just in case)
      user.role = invite.role;
      user.isActive = true;
      user.isVerified = true;
      user.orgid = invite.organizationId; // Ensure legacy field is also updated
      await user.save();
    }

    // 5. Mark invite as accepted
    await inviteDao.updateInviteStatus(invite._id, true);
    return { user, invite };
  },
};
