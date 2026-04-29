import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../configs/env.config.js";
// Generate access token (15 minutes)

export const generateAccessToken = (userId, orgid, role) => {
  return jwt.sign({ id: userId, orgid, role }, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn: ENV.ACCESS_TOKEN_EXPIRY || "15m",
  });
};

// Generate refresh token (7 days)
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET);
};
export const verifyAccessToken = (token) => {
  return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
};

// Generate organization API key
export const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Generate invite token
export const generateInviteToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Cookie options
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
