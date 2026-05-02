import asyncHandler from "../../utils/Error/asyncHandler.js";
import { ApiResponse } from "../../utils/Error/ApiResponse.js";
import { ApiError } from "../../utils/Error/ApiError.js";
import { authService } from "./auth.service.js";
import { authDao } from "./auth.dao.js";

// @desc    Register Organization
// @route   POST /api/auth/orgregister
// @access  Public
export const registerOrganization = asyncHandler(async (req, res, next) => {
  const result = await authService.registerOrganization(req.body);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        organization: {
          id: result.organization._id,
          name: result.organization.organizationName,
          email: result.organization.email,
          apiKeys: result.organization.apiKeys,
        },
        user: {
          id: result.adminUser._id,
          name: result.adminUser.name,
          email: result.adminUser.email,
          role: result.adminUser.role,
          oncall: true,
          sessionId: result.sessionId, // NEW: attach session ID
        },
        accessToken: result.accessToken,
      },
      "Organization registered successfully",
    ),
  );
});

// @desc    Verify Email
// @route   GET /api/verify/email/:id
// @access  Public
export const verifyEmail = asyncHandler(async (req, res, next) => {
  const result = await authService.verifyEmail(req.params.id);
  res.status(201).send(result.html);
});

// @desc    Organization Login
// @route   POST /api/auth/orglogin
// @access  Public
export const loginOrganization = asyncHandler(async (req, res, next) => {
  const ip = req.ip;
  const userAgent = req.headers["user-agent"];
  const { email, password } = req.body;

  const result = await authService.loginOrganization({ email, password, ip, userAgent });

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        organizations: result.memberships.map((m) => ({
          organizationId: m.organizationId?._id || m.organizationId,
          role: m.role,
        })),
        accessToken: result.accessToken,
      },
      "Login successful",
    ),
  );
});

// @desc    Get Me
// @route   GET /api/auth/getme
// @access  Private
export const get_me = asyncHandler(async (req, res, next) => {
  const id = req.user.id;
  const isuser = await authDao.findUserById(id);

  if (!isuser) throw new ApiError(404, "User not found");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        id: isuser._id,
        name: isuser.name,
        email: isuser.email,
        role: req.user.role,
        organizationId: req.user.organizationId,
      },
      "Data fetched successfully",
    ),
  );
});

// @desc Invite User
// @route POST /api/auth/inviteuser
// @access Admin Only
export const inviteUser = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  const organizationId = req.user.organizationId;
  if (!organizationId) {
    console.error("[AUTH-INVITE] organizationId is undefined in req.user. User context:", req.user);
    throw new ApiError(403, "Organization context missing. Please re-login.");
  }

  const user = await authService.inviteUser({ name, email, role, organizationId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      "Invitation sent successfully",
    ),
  );
});

// @desc Accept User Invitation
// @route POST /api/auth/acceptinvite
// @access Public
export const acceptInvite = asyncHandler(async (req, res, next) => {
  await authService.acceptInvite(req.body);

  return res.status(200).json(new ApiResponse(200, null, "Account activated successfully"));
});

// @desc Refresh Access Token
// @route GET /api/refresh_token
// @access Public
export const refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.refreshToken;
  const newAccessToken = await authService.refreshToken(token);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        accessToken: newAccessToken,
      },
      "Token refreshed successfully",
    ),
  );
});

// @desc Logout User (stateful — deletes Redis session)
// @route POST /api/auth/logout
// @access Private (requires auth to identify session)
export const logout = asyncHandler(async (req, res, next) => {
  const { id: userId, sessionId } = req.user;

  await authService.logout(userId, sessionId);

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});
