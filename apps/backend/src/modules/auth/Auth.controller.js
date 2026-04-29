import asyncHandler from "../../utils/Error/asyncHandler.js";
import { ApiError } from "@/utils/Error/ApiError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Organization from "./models/organisation.js";
import User from "./models/user.js";
import sendEmail from "../../services/Email/sendEmail.js";
import sessionModel from "./models/session.model.js";
import { connectRedis } from "@/configs/redis.config.js";

import {
  generateAccessToken,
  generateRefreshToken,
  generateInviteToken,
  verifyRefreshToken,
} from "../../utils/generateToken.js";
import {
  verifyEmail_msg,
  getInviteEmailTemplate,
  getWelcomeEmailTemplate,
  getOrgWelcomeTemplate,
} from "../../services/Email/Email_msg.js";
import { success } from "zod";

// @desc    Register Organization
// @route   POST /api/auth/org/register
// @access  Public
export const registerOrganization = asyncHandler(async (req, res, next) => {
  const { name, org_name, email, password } = req.body;

  const orgExists = await Organization.findOne({ email });
  if (orgExists) {
    return next(new ApiError(404, "Organization already exists with this email"));
  }

  const organization = await Organization.create({
    org_name,
    email,
    password,
  });
  if (!organization) return next(new ApiError(403, "organisation not"));

  const adminUser = await User.create({
    name: `${name} Admin`,
    email: organization.email,
    password: password,
    role: "admin",
    orgid: organization._id,
    isActive: true,
  });

  const refreshToken = generateRefreshToken(adminUser._id);

  await sendEmail({
    to: adminUser.email,
    subject: `Verify your email – ${organization.org_name}`,
    html: verifyEmail_msg(refreshToken),
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: "Organization registered successfully",
    data: {
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
        oncall: true,
      },
    },
  });
});

//verify_Email-controllers

export const verifyEmail = asyncHandler(async (req, res, next) => {
  const token = req.params.id;
  if (!token) return next(new ApiError(404, "token not recieved"));
  const decode = verifyRefreshToken(token);

  if (!decode) return next(new ApiError(404, "invalid token"));
  const userid = decode.id;

  const isuser = await User.findById(userid);
  if (!isuser) return next(new ApiError(404, "user not found"));

  const isOrganization = await Organization.findById(isuser.orgid);
  if (!isOrganization) return next(new ApiError(404, "Organization not found"));

  const updateuser = await User.findByIdAndUpdate(userid, { $set: { isverify: true } });
  const updateorg = await Organization.findByIdAndUpdate(isuser.orgid, {
    $set: { isverify: true },
  });

  if (!updateuser && !updateorg) return next(new ApiError(400, "Account not verified."));

  res.status(201).send(getOrgWelcomeTemplate(isOrganization.org_name));
});

// @desc    Organization Login
// @route   POST /api/auth/org/login
// @access  Public

export const loginOrganization = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const isuser = await User.findOne({ email }).select("+password");

  if (!isuser) {
    return next(new ApiError(401, "Invalid credentials"));
  }

  const ispassword = await isuser.comparePassword(password);

  if (!ispassword) {
    return next(new ApiError(401, "Invalid credentials 2"));
  }

  if (!isuser.isverify) return next(new ApiError(401, "user not verified"));

  const accessToken = generateAccessToken(isuser._id, isuser.orgid, "admin");

  const refreshToken = generateRefreshToken(isuser._id);

  const session = await sessionModel.create({
    user: isuser._id,
    ip: req.ip,
    agent: req.headers["user-agent"],
    refreshToken: refreshToken,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Login successful",
    data: {
      id: isuser._id,
      name: isuser.name,
      email: isuser.email,
      role: isuser.role,
    },
    accessToken,
  });
});

export const get_me = asyncHandler(async (req, res, next) => {
  const id = req.user.id;
  const isuser = await User.findById(id).populate("orgid");
  if (!isuser) return next(new ApiError("403", " user data not fetched"));

  res.status(200).json({
    message: "data fetched successfully",
    success: true,
    data: {
      org_name: isuser.orgid.org_name,
      name: isuser.name,
      email: isuser.email,
      role: isuser.role,
      oncall: isuser.oncall,
    },
  });
});

// @desc Invite User
// @route POST /api/org/invite
// @access Admin Only

export const inviteUser = asyncHandler(async (req, res, next) => {
  const { name, email, role } = req.body;
  const orgId = req.user.orgid; // from admin token

  // check org exists
  const organization = await Organization.findById(orgId);
  if (!organization) {
    return next(new ApiError(404, "Organization not found"));
  }

  // check user already exists
  const existingUser = await User.findOne({ email, orgid: orgId });
  if (existingUser) {
    return next(new ApiError(400, "User already exists in this organization"));
  }

  // generate invite token
  const inviteToken = generateInviteToken();

  // create user (NOT ACTIVE YET)
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

  // frontend link
  const inviteLink = `${process.env.FRONTEND_URL}/accept-invite?token=${inviteToken}&email=${email}`;

  // send email
  const html = getInviteEmailTemplate(inviteToken, organization.org_name, email);

  await sendEmail({
    to: email,
    subject: `Invitation to join ${organization.org_name}`,
    html,
  });

  res.status(200).json({
    success: true,
    message: "Invitation sent successfully",
    data: {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

//user accept invitation via admin

export const acceptInvite = asyncHandler(async (req, res, next) => {
  const { token, email, name, password } = req.body;

  if (!token || !email) {
    return next(new ApiError(400, "Invalid request"));
  }

  // 2. find user
  const user = await User.findOne({ email, inviteToken: token });

  if (!user) {
    return next(new ApiError(404, "Invite not found"));
  }

  // 4. activate user
  user.name = name;
  user.password = password; // will be hashed in pre-save
  user.isverify = true;
  user.inviteToken = null;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Account activated successfully",
  });
});

// // @desc    Refresh Access Token
// // @route   POST /api/auth/refresh
// // @access  Public

export const refreshToken = asyncHandler(async (req, res, next) => {
  // 1. get refresh token
  const token = req.cookies?.refreshToken;

  if (!token) {
    return next(new ApiError(401, "Refresh token not provided"));
  }

  // 2. verify token
  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    return next(new ApiError(401, "Invalid refresh token"));
  }

  // 🔥 1. Redis blacklist check (MOST IMPORTANT PART)
  try {
    const redis = await connectRedis();

    if (redis) {
      const isBlacklisted = await redis.get(`blacklist:refresh:${token}`);

      if (isBlacklisted) {
        return next(new ApiError(401, "Refresh token revoked (logout)"));
      }
    }
  } catch (err) {
    console.log("Redis error:", err.message);
  }

  // 3. check session exists
  const session = await sessionModel.findOne({ refreshToken: token });
  if (!session) {
    return next(new ApiError(401, "Session expired or not found"));
  }

  // 4. find user
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  // 5. generate new access token
  const newAccessToken = generateAccessToken(
    user._id,

    user.orgid,
    user.role,
  );

  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    accessToken: newAccessToken,
  });
});

//logout

export const logout = asyncHandler(async (req, res, next) => {
  // 1. get refresh token from cookie or header
  const token = req.cookies?.refreshToken;

  if (!token) {
    return next(new ApiError(400, "No refresh token found"));
  }

  // 2. delete session from DB
  const deletedSession = await sessionModel.findOneAndDelete({
    refreshToken: token,
  });

  if (!deletedSession) {
    return next(new ApiError(404, "Session already expired or not found"));
  }

  // 3. 🔥 REDIS ADDITION (ONLY THIS IS NEW)
  try {
    const redis = await connectRedis();

    if (redis) {
      await redis.set(`blacklist:refresh:${token}`, "true", "EX", 7 * 24 * 60 * 60);
    }
  } catch (err) {
    console.log("Redis error in logout:", err.message);
  }

  // 3. clear cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // 4. response
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
