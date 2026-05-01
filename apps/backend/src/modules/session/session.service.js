import { getRedis } from "../../configs/redis.config.js";
import { ENV } from "../../configs/env.config.js";
import { getSessionKey, getUserSessionsPattern } from "./session.constants.js";
import { generateSessionId } from "../../utils/generateToken.js";

export const sessionService = {
  /**
   * Create a new session in Redis
   * @param {string} userId
   * @param {Object} data - { orgId, role, ip, agent }
   * @returns {Promise<string>} sessionId
   */
  createSession: async (userId, { organizationId, role, ip, agent }) => {
    const redis = getRedis();
    const sessionId = generateSessionId();
    const key = getSessionKey(userId, sessionId);

    const sessionData = {
      userId: userId.toString(),
      organizationId: organizationId?.toString() || "",
      role: role || "",
      ip: ip || "unknown",
      agent: agent || "unknown",
      createdAt: new Date().toISOString(),
    };

    // Store as hash
    await redis.hset(key, sessionData);
    // Set expiry
    await redis.expire(key, ENV.SESSION_TTL);

    return sessionId;
  },

  /**
   * Verify if a session exists and return its data
   * @param {string} userId
   * @param {string} sessionId
   */
  getSession: async (userId, sessionId) => {
    const redis = getRedis();
    const key = getSessionKey(userId, sessionId);
    const data = await redis.hgetall(key);

    if (Object.keys(data).length === 0) return null;
    return data;
  },

  /**
   * Delete a specific session (Logout)
   */
  revokeSession: async (userId, sessionId) => {
    const redis = getRedis();
    const key = getSessionKey(userId, sessionId);
    return await redis.del(key);
  },

  /**
   * Revoke all sessions for a specific user
   */
  revokeAllUserSessions: async (userId) => {
    const redis = getRedis();
    const pattern = getUserSessionsPattern(userId);
    const keys = await redis.keys(pattern);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return keys.length;
  },

  /**
   * Get all active sessions for a user (useful for security dashboard)
   */
  listUserSessions: async (userId) => {
    const redis = getRedis();
    const pattern = getUserSessionsPattern(userId);
    const keys = await redis.keys(pattern);

    const sessions = [];
    for (const key of keys) {
      const data = await redis.hgetall(key);
      const sessionId = key.split(":").pop();
      sessions.push({ sessionId, ...data });
    }
    return sessions;
  },
};
