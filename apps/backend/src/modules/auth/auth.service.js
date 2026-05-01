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
  registerOrganization: async ({ name, organizationName, email, password }) => {
    const orgExists = await authDao.findOrganizationByEmail(email);
    if (orgExists) {
      throw new ApiError(404, "Organization already exists with this email");
    }

    const organization = await authDao.createOrganization({
      organizationName,
      email,
      password,
    });
    if (!organization) throw new ApiError(403, "Organization not created");

    const adminUser = await authDao.createUser({
      name: `${name} Admin`,
      email: organization.email,
      password: password,
      role: "admin",
      organizationId: organization._id,
      orgid: organization._id,
      isActive: true,
    });

    // Create session via sessionService
    const sessionId = await sessionService.createSession(adminUser._id, {
      organizationId: organization._id,
      role: "admin",
      ip: "registration",
      agent: "registration",
    });

    const accessToken = generateAccessToken({
      id: adminUser._id,
      organizationId: organization._id.toString(),
      role: "admin",
      sessionId,
    });
    const refreshToken = generateRefreshToken(adminUser._id, sessionId);

    await sendEmail({
      to: adminUser.email,
      subject: `Verify your email – ${organization.organizationName}`,
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

    const isOrganization = await authDao.findOrganizationById(isuser.organizationId);
    if (!isOrganization) throw new ApiError(404, "Organization not found");

    const updateuser = await authDao.updateUser(userid, { isVerified: true });
    const updateorg = await authDao.updateOrganization(isuser.organizationId, { isVerified: true });

    if (!updateuser && !updateorg) throw new ApiError(400, "Account not verified.");

    return { html: getOrgWelcomeTemplate(isOrganization.organizationName) };
  },

  loginOrganization: async ({ email, password, ip, userAgent }) => {
    const isuser = await authDao.findUserByEmail(email);
    if (!isuser) throw new ApiError(401, "Invalid credentials");

    const ispassword = await isuser.comparePassword(password);
    if (!ispassword) throw new ApiError(401, "Invalid credentials");

    if (!isuser.isVerified) throw new ApiError(401, "User not verified");

    console.log("USER:", isuser);

    const userObj = isuser.toObject();
    const organizationId = userObj.organizationId || userObj.orgid;

    if (!organizationId) {
      console.error("USER OBJ:", userObj);
      throw new ApiError(500, "Organization ID missing in DB");
    }

    // Create session via sessionService
    const sessionId = await sessionService.createSession(userObj._id, {
      organizationId: organizationId,
      role: userObj.role || "admin",
      ip,
      agent: userAgent,
    });

    const accessToken = generateAccessToken({
      id: userObj._id,
      organizationId: organizationId.toString(),
      role: userObj.role || "admin",
      sessionId,
    });
    const refreshToken = generateRefreshToken(userObj._id, sessionId);

    return { user: userObj, accessToken, refreshToken, sessionId };
  },

  getMe: async (userId) => {
    const isuser = await authDao.findUserByIdWithOrg(userId);
    if (!isuser) throw new ApiError(403, "User data not fetched");
    return isuser;
  },

  inviteUser: async ({ name, email, role, organizationId }) => {
    const organization = await authDao.findOrganizationById(organizationId);
    if (!organization) throw new ApiError(404, "Organization not found");

    const existingUser = await authDao.findUserByEmailAndOrganizationId(email, organizationId);
    if (existingUser) throw new ApiError(400, "User already exists in this organization");

    const inviteToken = generateInviteToken();
    const user = await authDao.createUser({
      name,
      email,
      role,
      organizationId,
      password: crypto.randomBytes(16).toString("hex"),
      isActive: false,
      isVerified: false,
      inviteToken,
      inviteTokenExpiry: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    });

    const html = getInviteEmailTemplate(inviteToken, organization.organizationName, email);

    try {
      await sendEmail({
        to: email,
        subject: `Invitation to join ${organization.organizationName}`,
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
    user.isVerified = true;
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

    const userObj = user.toObject();
    const organizationId = userObj.organizationId || userObj.orgid;

    if (!organizationId) {
      console.error("[REFRESH] organizationId/orgid missing for user object:", userObj);
      throw new ApiError(500, "User organizationId/orgid missing in DB");
    }

    const newAccessToken = generateAccessToken({
      id: userObj._id,
      organizationId: organizationId.toString(),
      role: session.role || userObj.role,
      sessionId,
    });
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
