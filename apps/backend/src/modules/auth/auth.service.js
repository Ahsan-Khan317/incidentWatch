import { authDao } from "./auth.dao.js";
import { ApiError } from "../../utils/Error/ApiError.js";
import sendEmail from "../../services/Email/sendEmail.js";
import crypto from "crypto";
import { sessionService } from "../session/session.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateInviteToken,
} from "../../utils/generateToken.js";
import {
  verifyEmail_msg,
  getOrgWelcomeTemplate,
  getInviteEmailTemplate,
} from "../../services/Email/Email_msg.js";

export const authService = {
  registerOrganization: async ({ name, org_name, email, password }) => {
    const orgExists = await authDao.findOrganizationByEmail(email);
    if (orgExists) {
      throw new ApiError(404, "Organization already exists with this email");
    }

    const organization = await authDao.createOrganization({
      org_name,
      email,
      password,
    });
    if (!organization) throw new ApiError(403, "Organization not created");

    const adminUser = await authDao.createUser({
      name: `${name} Admin`,
      email: organization.email,
      password: password,
      role: "admin",
      orgid: organization._id,
      isActive: true,
    });

    // Create session via sessionService
    const sessionId = await sessionService.createSession(adminUser._id, {
      orgId: organization._id,
      role: "admin",
      ip: "registration",
      agent: "registration",
    });

    const accessToken = generateAccessToken(adminUser._id, organization._id, "admin", sessionId);
    const refreshToken = generateRefreshToken(adminUser._id, sessionId);

    await sendEmail({
      to: adminUser.email,
      subject: `Verify your email – ${organization.org_name}`,
      html: verifyEmail_msg(refreshToken),
    });

    return { organization, adminUser, accessToken, refreshToken };
  },

  verifyEmail: async (token) => {
    if (!token) throw new ApiError(400, "Token not received");

    const decode = verifyRefreshToken(token);
    if (!decode) throw new ApiError(400, "Invalid token");

    const userid = decode.id;
    const isuser = await authDao.findUserById(userid);
    if (!isuser) throw new ApiError(404, "User not found");

    const isOrganization = await authDao.findOrganizationById(isuser.orgid);
    if (!isOrganization) throw new ApiError(404, "Organization not found");

    const updateuser = await authDao.updateUser(userid, { isverify: true });
    const updateorg = await authDao.updateOrganization(isuser.orgid, { isverify: true });

    if (!updateuser && !updateorg) throw new ApiError(400, "Account not verified.");

    return { html: getOrgWelcomeTemplate(isOrganization.org_name) };
  },

  loginOrganization: async ({ email, password, ip, userAgent }) => {
    const isuser = await authDao.findUserByEmail(email);
    if (!isuser) throw new ApiError(401, "Invalid credentials");

    const ispassword = await isuser.comparePassword(password);
    if (!ispassword) throw new ApiError(401, "Invalid credentials");

    if (!isuser.isverify) throw new ApiError(401, "User not verified");

    // Create session via sessionService
    const sessionId = await sessionService.createSession(isuser._id, {
      orgId: isuser.orgid,
      role: isuser.role || "admin",
      ip,
      agent: userAgent,
    });

    const accessToken = generateAccessToken(
      isuser._id,
      isuser.orgid,
      isuser.role || "admin",
      sessionId,
    );
    const refreshToken = generateRefreshToken(isuser._id, sessionId);

    return { user: isuser, accessToken, refreshToken, sessionId };
  },

  getMe: async (userId) => {
    const isuser = await authDao.findUserByIdWithOrg(userId);
    if (!isuser) throw new ApiError(403, "User data not fetched");
    return isuser;
  },

  inviteUser: async ({ name, email, role, orgId }) => {
    const organization = await authDao.findOrganizationById(orgId);
    if (!organization) throw new ApiError(404, "Organization not found");

    const existingUser = await authDao.findUserByEmailAndOrgId(email, orgId);
    if (existingUser) throw new ApiError(400, "User already exists in this organization");

    const inviteToken = generateInviteToken();
    const user = await authDao.createUser({
      name,
      email,
      role,
      orgid: orgId,
      password: crypto.randomBytes(16).toString("hex"),
      isActive: false,
      isverify: false,
      inviteToken,
      inviteTokenExpiry: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    });

    const html = getInviteEmailTemplate(inviteToken, organization.org_name, email);

    try {
      await sendEmail({
        to: email,
        subject: `Invitation to join ${organization.org_name}`,
        html,
      });
    } catch (error) {
      console.error("[EMAIL] Failed to send invite email:", error.message);
      throw new ApiError(500, "Failed to send invitation email");
    }

    return user;
  },

  acceptInvite: async ({ token, email, name, password }) => {
    const user = await authDao.findUserByInviteTokenAndEmail(email, token);
    if (!user) throw new ApiError(404, "Invite not found");

    user.name = name;
    user.password = password;
    user.isverify = true;
    user.inviteToken = null;
    await user.save();

    return user;
  },

  refreshToken: async (token) => {
    const decoded = verifyRefreshToken(token);
    if (!decoded) throw new ApiError(401, "Invalid refresh token");

    const { id: userId, sessionId } = decoded;

    if (!sessionId) {
      throw new ApiError(401, "Legacy token — please re-login");
    }

    // Verify session via sessionService
    const session = await sessionService.getSession(userId, sessionId);
    if (!session) {
      throw new ApiError(401, "Session expired or revoked");
    }

    const user = await authDao.findUserById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const newAccessToken = generateAccessToken(
      user._id,
      user.orgid,
      session.role || user.role,
      sessionId,
    );
    return newAccessToken;
  },

  logout: async (userId, sessionId) => {
    if (!userId || !sessionId) {
      throw new ApiError(400, "Invalid session");
    }

    const deleted = await sessionService.revokeSession(userId, sessionId);
    if (!deleted) {
      throw new ApiError(404, "Session already expired or not found");
    }

    return true;
  },

  logoutAll: async (userId) => {
    const count = await sessionService.revokeAllUserSessions(userId);
    return { sessionsRevoked: count };
  },
};
