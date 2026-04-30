// Auth Module Index
// Export all auth-related modules for easy importing

// Services
export { default as authService } from "./services/auth.service.js";
export { default as tokenService } from "./services/token.service.js";
export { default as sessionService } from "./services/session.service.js";

// Controllers
export * from "./controllers/auth.controller.js";

// Middleware
export * from "./middleware/auth.middleware.js";

// Routes
export { default as authRoutes } from "./routes/auth.routes.js";

// Config
export { getRedisClient, closeRedisConnection } from "./config/redis.js";

// Re-export commonly used functions
export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateApiKey,
  generateInviteToken,
  cookieOptions,
} from "./services/token.service.js";

export {
  storeSession,
  validateSession,
  deleteSession,
  blacklistToken,
  isBlacklisted,
  deleteAllUserSessions,
  getSession,
} from "./services/session.service.js";

export {
  registerOrganizationService,
  verifyEmailService,
  loginService,
  getMeService,
  inviteUserService,
  acceptInviteService,
  refreshTokenService,
  logoutService,
} from "./services/auth.service.js";
