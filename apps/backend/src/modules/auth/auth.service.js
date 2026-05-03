import { authDao } from "./auth.dao.js";
import { memberDao } from "../member/member.dao.js";
import Member from "../member/member.model.js";
import { ApiError } from "../../utils/Error/ApiError.js";
import sendEmail from "../../services/Email/sendEmail.js";
import crypto from "crypto";
import { sessionService } from "../session/session.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateInviteToken,
  generateVerificationToken,
  verifyVerificationToken,
} from "../../utils/generateToken.js";
import {
  verifyEmail_msg,
  getOrgWelcomeTemplate,
  getInviteEmailTemplate,
} from "../../services/Email/Email_msg.js";

export const authService = {
  registerOrganization: async ({ name, organizationName, email, password }) => {
    const userExists = await authDao.findUserByEmail(email);
    if (userExists) {
      throw new ApiError(404, "User already exists with this email");
    }

    const orgExists = await authDao.findOrganizationByEmail(email);
    if (orgExists) {
      throw new ApiError(404, "Organization already exists with this email");
    }

    const adminUser = await authDao.createUser({
      name: `${name} Admin`,
      email: email,
      password: password,
      role: "admin",
      isVerified: false,
      isActive: true,
    });

    const organization = await authDao.createOrganization({
      organizationName,
      email,
      password,
      ownerId: adminUser._id,
    });

    // Update user's organizationId
    adminUser.organizationId = organization._id;
    await adminUser.save();

    if (!organization) throw new ApiError(403, "Organization not created");

    // Create Member entry for admin
    await Member.create({
      userId: adminUser._id,
      organizationId: organization._id,
      role: "admin",
      isActive: true,
    });

    const verificationToken = generateVerificationToken(adminUser._id);

    await sendEmail({
      to: adminUser.email,
      subject: `Verify your email – ${organization.organizationName}`,
      html: verifyEmail_msg(verificationToken),
    });

    return { organization, adminUser };
  },
  verifyEmail: async (token) => {
    if (!token) throw new ApiError(400, "Token not received");

    const decode = verifyVerificationToken(token);
    if (!decode) throw new ApiError(400, "Invalid token");

    const userid = decode.id;
    console.log(userid);
    const user = await authDao.findUserById(userid);
    if (!user) throw new ApiError(404, "User not found");

    const organization = await authDao.findOrganizationById(user.organizationId);
    if (!organization) throw new ApiError(404, "Organization not found");

    const updateuser = await authDao.updateUser(userid, { isVerified: true });
    const updateorg = await authDao.updateOrganization(user.organizationId, {
      isVerified: true,
    });

    if (!updateuser && !updateorg) throw new ApiError(400, "Account not verified.");

    return { html: getOrgWelcomeTemplate(organization.organizationName) };
  },
  loginOrganization: async ({ email, password, ip, userAgent }) => {
    const isuser = await authDao.findUserByEmail(email);
    if (!isuser) throw new ApiError(401, "Invalid credentials");

    const ispassword = await isuser.comparePassword(password);
    if (!ispassword) throw new ApiError(401, "Invalid credentials");

    if (!isuser.isVerified) throw new ApiError(401, "User not verified");

    const userObj = isuser.toObject();

    // Fetch memberships
    const memberships = await memberDao.findMembersByUserId(userObj._id);

    if (!memberships || memberships.length === 0) {
      throw new ApiError(403, "User is not part of any organization");
    }

    // Use the first membership as the default context
    const primaryMembership = memberships[0];
    const organizationId = primaryMembership.organizationId._id || primaryMembership.organizationId;
    const role = primaryMembership.role;

    // Create session via sessionService
    const sessionId = await sessionService.createSession(userObj._id, {
      organizationId: organizationId.toString(),
      role: role,
      ip,
      agent: userAgent,
    });

    const accessToken = generateAccessToken({
      id: userObj._id,
      organizationId: organizationId.toString(),
      role: role,
      sessionId,
    });
    const refreshToken = generateRefreshToken(userObj._id, sessionId);

    return { user: userObj, memberships, accessToken, refreshToken, sessionId };
  },
  getMe: async (userId) => {
    const isuser = await authDao.findUserById(userId);
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
      password: crypto.randomBytes(16).toString("hex"),
      isActive: false,
      isVerified: false,
      inviteToken,
      inviteTokenExpiry: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    });

    // Store membership in Member model (inactive)
    await Member.create({
      userId: user._id,
      organizationId,
      role: role || "viewer",
      isActive: false,
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

    // Activate membership
    await Member.findOneAndUpdate({ userId: user._id, isActive: false }, { isActive: true });

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

    // Get organizationId from session or fallback to first membership
    let organizationId = session.organizationId || session.orgid;

    if (!organizationId) {
      const memberships = await memberDao.findMembersByUserId(userId);
      if (memberships && memberships.length > 0) {
        organizationId = memberships[0].organizationId._id || memberships[0].organizationId;
      }
    }

    if (!organizationId) {
      throw new ApiError(403, "User is not part of any organization");
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
