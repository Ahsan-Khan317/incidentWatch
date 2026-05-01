import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../configs/env.config.js";

// Generate a unique session ID (UUID v4 via crypto)
export const generateSessionId = () => {
  return crypto.randomUUID();
};

// Generate access token — now includes sessionId for stateful verification
export const generateAccessToken = ({ id, organizationId, role, sessionId }) => {
  return jwt.sign({ id, organizationId, role, sessionId }, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn: ENV.ACCESS_TOKEN_EXPIRY || "15m",
  });
};

// Generate refresh token — includes sessionId to tie refresh to session
export const generateRefreshToken = (userId, sessionId) => {
  return jwt.sign({ id: userId, sessionId }, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET);
};

// Verify access token
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
