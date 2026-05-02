import { ApiError } from "../../utils/Error/ApiError.js";
import { inviteDao } from "./invite.dao.js";
import { authDao } from "../auth/auth.dao.js";
import { memberDao } from "../member/member.dao.js";
import { generateInviteToken } from "../../utils/generateToken.js";
import sendEmail from "../../services/Email/sendEmail.js";
import { getInviteEmailTemplate } from "../../services/Email/Email_msg.js";

export const inviteService = {
  inviteMember: async ({ email, role, organizationId }) => {
    console.log("INVITE SERVICE ORG ID:", organizationId);
    // 1. Check if user already exists
    const user = await authDao.findUserByEmail(email);
    if (user) {
      // Check if already a member of this organization
      const existingMember = await memberDao.findMemberByUserAndOrg(user._id, organizationId);
      if (existingMember) {
        throw new ApiError(400, "User is already a member of this organization");
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

  acceptInvite: async ({ token, name, password }) => {
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

    // 2. Check if user already exists (by email)
    let user = await authDao.findUserByEmail(invite.email);

    if (!user) {
      // 3. If not, create user
      user = await authDao.createUser({
        name: name,
        email: invite.email,
        password: password,
        isVerified: true,
      });
    }

    // 4. Create Member entry
    // Check if member already exists (redundant but safe)
    const existingMember = await memberDao.findMemberByUserAndOrg(user._id, invite.organizationId);
    if (existingMember) {
      throw new ApiError(400, "User is already a member of this organization");
    }

    await memberDao.createMember({
      userId: user._id,
      organizationId: invite.organizationId,
      role: invite.role,
    });

    // 5. Mark invite as accepted
    await inviteDao.updateInviteStatus(invite._id, true);
    return { user, invite };
  },
};
