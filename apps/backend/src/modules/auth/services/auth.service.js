import crypto from "crypto";
import Organization from "../models/organisation.js";
import User from "../models/user.js";
import sendEmail from "../../../services/Email/sendEmail.js";
import {
  verifyEmail_msg,
  getInviteEmailTemplate,
  getOrgWelcomeTemplate,
} from "../../../services/Email/Email_msg.js";
import { ApiError } from "../../../utils/Error/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateInviteToken,
  cookieOptions,
  verifyRefreshToken,
} from "./token.service.js";
import {
  storeSession,
  validateSession,
  deleteSession,
  blacklistToken,
  isBlacklisted,
  deleteAllUserSessions,
} from "./session.service.js";

/**
 * Register organization and create admin user
 * @param {object} params - { name, org_name, email, password }
 * @returns {Promise<object>} - { organization, user, refreshToken, accessToken }
 */
export const registerOrganizationService = async ({ name, org_name, email, password }) => {
  // Check if organization exists
  const orgExists = await Organization.findOne({ email });
  if (orgExists) {
    throw new ApiError(400, "Organization already exists with this email");
  }

  // Create organization
  const organization = await Organization.create({
    org_name,
    email,
    password,
  });

  if (!organization) {
    throw new ApiError(500, "Failed to create organization");
  }

  // Create admin user
  const adminUser = await User.create({
    name: `${name} Admin`,
    email: organization.email,
    password,
    role: "admin",
    orgid: organization._id,
    isActive: true,
  });

  if (!adminUser) {
    throw new ApiError(500, "Failed to create admin user");
  }

  // Generate refresh token for email verification
  const refreshToken = generateRefreshToken(adminUser._id);

  // Send verification email (non-blocking - don't await)
  const html = verifyEmail_msg(refreshToken);
  sendEmail({
    to: adminUser.email,
    subject: `Verify your email – ${organization.org_name}`,
    html,
  }).catch((err) => console.error("Email send failed:", err.message));

  return {
    organization: {
      id: organization._id,
      name: organization.name,
      email: organization.email,
      apiKey: organization.apiKey,
    },
    user: {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      oncall: adminUser.oncall,
    },
    refreshToken,
  };
};

/**
 * Verify user email
 * @param {string} token - Refresh token as verification token
 * @returns {Promise<object>} - { user, organization }
 */
export const verifyEmailService = async (token) => {
  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    throw new ApiError(401, "Invalid verification token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const organization = await Organization.findById(user.orgid);
  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  // Update both user and organization
  await User.findByIdAndUpdate(user._id, { $set: { isverify: true } });
  await Organization.findByIdAndUpdate(organization._id, { $set: { isverify: true } });

  return {
    user,
    organization,
    orgName: organization.org_name,
  };
};

/**
 * Login organization/user
 * @param {object} params - { email, password, ip, userAgent }
 * @returns {Promise<object>} - { user, accessToken, refreshToken }
 */
export const loginService = async ({ email, password, ip, userAgent }) => {
  // Find user with password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check if user is verified
  if (!user.isverify) {
    throw new ApiError(401, "User not verified");
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id, user.orgid, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Store session in Redis
  await storeSession(user._id, refreshToken, { ip, userAgent });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

/**
 * Get current user profile
 * @param {string} userId - User ID
 * @returns {Promise<object>} - User profile data
 */
export const getMeService = async (userId) => {
  const user = await User.findById(userId).populate("orgid");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    org_name: user.orgid.org_name,
    name: user.name,
    email: user.email,
    role: user.role,
    oncall: user.oncall,
  };
};

/**
 * Invite user to organization
 * @param {object} params - { name, email, role, orgId }
 * @returns {Promise<object>} - { user, inviteLink }
 */
export const inviteUserService = async ({ name, email, role, orgId }) => {
  // Check organization exists
  const organization = await Organization.findById(orgId);
  if (!organization) {
    throw new ApiError(404, "Organization not found");
  }

  // Check user already exists
  const existingUser = await User.findOne({ email, orgid: orgId });
  if (existingUser) {
    throw new ApiError(400, "User already exists in this organization");
  }

  // Generate invite token
  const inviteToken = generateInviteToken();

  // Create user (NOT ACTIVE YET)
  const user = await User.create({
    name,
    email,
    role,
    orgid: orgId,
    password: crypto.randomBytes(16).toString("hex"), // temporary password
    isActive: false,
    isverify: false,
    inviteToken,
    inviteTokenExpiry: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
  });

  // Generate invite link
  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${inviteToken}&email=${email}`;

  // Send email (non-blocking)
  const html = getInviteEmailTemplate(inviteToken, organization.org_name, email);
  sendEmail({
    to: email,
    subject: `Invitation to join ${organization.org_name}`,
    html,
  }).catch((err) => console.error("Invite email failed:", err.message));

  return {
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    inviteLink,
  };
};

/**
 * Accept invitation and activate user
 * @param {object} params - { token, email, name, password }
 * @returns {Promise<boolean>}
 */
export const acceptInviteService = async ({ token, email, name, password }) => {
  // Find user with invite token
  const user = await User.findOne({ email, inviteToken: token });

  if (!user) {
    throw new ApiError(404, "Invite not found or expired");
  }

  // Check if invite token is expired
  if (user.inviteTokenExpiry && user.inviteTokenExpiry < Date.now()) {
    throw new ApiError(400, "Invite token expired");
  }

  // Update user details
  user.name = name;
  user.password = password;
  user.isverify = true;
  user.inviteToken = null;
  user.inviteTokenExpiry = null;

  await user.save();

  return true;
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<object>} - { accessToken }
 */
export const refreshTokenService = async (refreshToken) => {
  // Verify token
  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded) {
    throw new ApiError(401, "Invalid refresh token");
  }

  // Check blacklist
  const blacklisted = await isBlacklisted(refreshToken);
  if (blacklisted) {
    throw new ApiError(401, "Refresh token revoked (logout)");
  }

  // Validate session in Redis
  const sessionValid = await validateSession(decoded.id, refreshToken);
  if (!sessionValid) {
    throw new ApiError(401, "Session expired or not found");
  }

  // Find user
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Generate new access token
  const newAccessToken = generateAccessToken(user._id, user.orgid, user.role);

  return { accessToken: newAccessToken };
};

/**
 * Logout user
 * @param {string} userId - User ID
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<boolean>}
 */
export const logoutService = async (userId, refreshToken) => {
  // Delete session from Redis
  await deleteSession(userId, refreshToken);

  // Add to blacklist
  await blacklistToken(refreshToken);

  return true;
};

export default {
  registerOrganizationService,
  verifyEmailService,
  loginService,
  getMeService,
  inviteUserService,
  acceptInviteService,
  refreshTokenService,
  logoutService,
};
