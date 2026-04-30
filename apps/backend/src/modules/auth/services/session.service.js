import { getRedisClient } from "../config/redis.js";
import { verifyRefreshToken } from "./token.service.js";

const BLACKLIST_PREFIX = "blacklist:refresh:";
const SESSION_PREFIX = "session:";

/**
 * Store session in Redis
 * @param {string} userId - User ID
 * @param {string} refreshToken - Refresh token
 * @param {object} metadata - Optional metadata (ip, userAgent)
 * @returns {Promise<boolean>}
 */
export const storeSession = async (userId, refreshToken, metadata = {}) => {
  const redis = await getRedisClient();
  if (!redis) {
    console.error("Redis not available for session storage");
    return false;
  }

  const key = `${SESSION_PREFIX}${userId}:${refreshToken}`;
  const value = JSON.stringify({
    refreshToken,
    createdAt: Date.now(),
    ip: metadata.ip || null,
    userAgent: metadata.userAgent || null,
  });

  // 7 days expiry
  await redis.setex(key, 7 * 24 * 60 * 60, value);
  return true;
};

/**
 * Validate session exists in Redis
 * @param {string} userId - User ID
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<boolean>}
 */
export const validateSession = async (userId, refreshToken) => {
  const redis = await getRedisClient();
  if (!redis) return false;

  const key = `${SESSION_PREFIX}${userId}:${refreshToken}`;
  const session = await redis.get(key);
  return !!session;
};

/**
 * Delete session from Redis
 * @param {string} userId - User ID
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<boolean>}
 */
export const deleteSession = async (userId, refreshToken) => {
  const redis = await getRedisClient();
  if (!redis) return false;

  const key = `${SESSION_PREFIX}${userId}:${refreshToken}`;
  const result = await redis.del(key);
  return result > 0;
};

/**
 * Add refresh token to blacklist
 * @param {string} refreshToken - Refresh token to blacklist
 * @returns {Promise<boolean>}
 */
export const blacklistToken = async (refreshToken) => {
  const redis = await getRedisClient();
  if (!redis) return false;

  const key = `${BLACKLIST_PREFIX}${refreshToken}`;
  // Blacklist for 7 days (same as token expiry)
  await redis.setex(key, 7 * 24 * 60 * 60, "true");
  return true;
};

/**
 * Check if token is blacklisted
 * @param {string} refreshToken - Refresh token to check
 * @returns {Promise<boolean>}
 */
export const isBlacklisted = async (refreshToken) => {
  const redis = await getRedisClient();
  if (!redis) return false;

  const key = `${BLACKLIST_PREFIX}${refreshToken}`;
  const result = await redis.get(key);
  return !!result;
};

/**
 * Delete all sessions for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Number of deleted sessions
 */
export const deleteAllUserSessions = async (userId) => {
  const redis = await getRedisClient();
  if (!redis) return 0;

  // Find all session keys for this user
  const pattern = `${SESSION_PREFIX}${userId}:*`;
  const keys = await redis.keys(pattern);

  if (keys.length > 0) {
    return await redis.del(...keys);
  }
  return 0;
};

/**
 * Get session metadata
 * @param {string} userId - User ID
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<object|null>}
 */
export const getSession = async (userId, refreshToken) => {
  const redis = await getRedisClient();
  if (!redis) return null;

  const key = `${SESSION_PREFIX}${userId}:${refreshToken}`;
  const session = await redis.get(key);
  return session ? JSON.parse(session) : null;
};

export default {
  storeSession,
  validateSession,
  deleteSession,
  blacklistToken,
  isBlacklisted,
  deleteAllUserSessions,
  getSession,
};
