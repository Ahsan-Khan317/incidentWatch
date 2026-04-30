import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ENV } from "../../../configs/env.config.js";

// Session duration constants (in seconds)
const SESSION_EXPIRY = 7 * 24 * 60 * 60; // 7 days
const ACCESS_TOKEN_EXPIRY = ENV.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = ENV.REFRESH_TOKEN_EXPIRY || "7d";

/**
 * Generate access token
 * @param {string} userId - User ID
 * @param {string} orgId - Organization ID
 * @param {string} role - User role
 * @returns {string} Access token
 */
export const generateAccessToken = (userId, orgId, role) => {
  return jwt.sign({ id: userId, orgid: orgId, role }, ENV.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generate refresh token
 * @param {string} userId - User ID
 * @returns {string} Refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, ENV.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * Verify access token
 * @param {string} token - Access token
 * @returns {object|null} Decoded token or null
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token
 * @returns {object|null} Decoded token or null
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Generate organization API key
 * @returns {string} API key
 */
export const generateApiKey = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Generate invite token
 * @returns {string} Invite token
 */
export const generateInviteToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Cookie options for refresh token
 */
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: SESSION_EXPIRY * 1000,
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateApiKey,
  generateInviteToken,
  cookieOptions,
  SESSION_EXPIRY,
};
