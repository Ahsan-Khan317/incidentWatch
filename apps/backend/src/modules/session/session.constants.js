/**
 * Redis Key Prefixes for Sessions
 * Structure: session:{userId}:{sessionId}
 */
export const SESSION_KEY_PREFIX = "iw:session";

export const getSessionKey = (userId, sessionId) => `${SESSION_KEY_PREFIX}:${userId}:${sessionId}`;
export const getUserSessionsPattern = (userId) => `${SESSION_KEY_PREFIX}:${userId}:*`;
