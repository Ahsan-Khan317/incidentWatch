import asyncHandler from "../../../utils/Error/asyncHandler.js";
import { ApiError } from "../../../utils/Error/ApiError.js";
import { getOrgWelcomeTemplate } from "../../../services/Email/Email_msg.js";
import {
  registerOrganizationService,
  verifyEmailService,
  loginService,
  getMeService,
  inviteUserService,
  acceptInviteService,
  refreshTokenService,
  logoutService,
} from "../services/auth.service.js";
import { cookieOptions } from "../services/token.service.js";

// @desc    Register Organization
// @route   POST /api/auth/org/register
// @access  Public
export const registerOrganization = asyncHandler(async (req, res, next) => {
  const { name, org_name, email, password } = req.body;

  const result = await registerOrganizationService({
    name,
    org_name,
    email,
    password,
  });

  // Set refresh token cookie
  res.cookie("refreshToken", result.refreshToken, cookieOptions);

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Organization registered successfully",
    data: {
      organization: result.organization,
      user: result.user,
    },
  });
});

// @desc    Verify Email
// @route   GET /api/auth/verify/email/:id
// @access  Public
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const token = req.params.id;

  if (!token) {
    throw new ApiError(400, "Token not received");
  }

  const result = await verifyEmailService(token);
  res.send(getOrgWelcomeTemplate(result.orgName));
});

// @desc    Organization Login
// @route   POST /api/auth/org/login
// @access  Public
export const loginOrganization = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const result = await loginService({
    email,
    password,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  // Set refresh token cookie
  res.cookie("refreshToken", result.refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Login successful",
    data: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    },
    accessToken: result.accessToken,
  });
});

// @desc    Get Current User
// @route   GET /api/auth/getme
// @access  Private
export const get_me = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;

  const userData = await getMeService(userId);

  res.status(200).json({
    success: true,
    message: "User data fetched successfully",
    data: userData,
  });
});

// @desc    Invite User
// @route   POST /api/auth/inviteuser
// @access  Admin Only
export const inviteUser = asyncHandler(async (req, res, next) => {
  const { name, email, role } = req.body;
  const orgId = req.user.orgid;

  const result = await inviteUserService({
    name,
    email,
    role,
    orgId,
  });

  res.status(200).json({
    success: true,
    message: "Invitation sent successfully",
    data: result.user,
  });
});

// @desc    Accept Invite
// @route   POST /api/auth/acceptinvite
// @access  Public
export const acceptInvite = asyncHandler(async (req, res, next) => {
  const { token, email, name, password } = req.body;

  if (!token || !email) {
    throw new ApiError(400, "Invalid request");
  }

  await acceptInviteService({
    token,
    email,
    name,
    password,
  });

  res.status(200).json({
    success: true,
    message: "Account activated successfully",
  });
});

// @desc    Refresh Token
// @route   GET /api/auth/refresh_token
// @access  Public
export const refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(401, "Refresh token not provided");
  }

  const result = await refreshTokenService(token);

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    accessToken: result.accessToken,
  });
});

// @desc    Logout
// @route   GET /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new ApiError(400, "No refresh token found");
  }

  await logoutService(req.user.id, token);

  // Clear cookie
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export default {
  registerOrganization,
  verifyEmail,
  loginOrganization,
  get_me,
  inviteUser,
  acceptInvite,
  refreshToken,
  logout,
};
