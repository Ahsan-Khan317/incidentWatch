import morgan from "morgan";
import chalk from "chalk";
import { logger } from "../utils/logger.js";

/**
 * Morgan-based request logger that uses Winston for output.
 * Provides consistent formatting for all API traffic.
 */
export const loggerMiddleware = morgan((tokens, req, res) => {
  const status = Number(tokens.status(req, res));
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const responseTime = tokens["response-time"](req, res);

  const message = `${method} ${url} ${status} - ${responseTime}ms`;

  if (status >= 500) {
    logger.error(`Response Error: ${message}`);
  } else if (status >= 400) {
    logger.warn(`Client Error: ${message}`);
  } else {
    logger.success(`Request: ${message}`);
  }

  // Debug logging for payloads (non-production)
  if (process.env.NODE_ENV !== "production") {
    if (Object.keys(req.query).length) {
      logger.debug("  Query Params:", req.query);
    }
    if (
      req.body &&
      Object.keys(req.body).length &&
      !url.includes("login") &&
      !url.includes("register")
    ) {
      const logBody = { ...req.body };
      if (logBody.password) logBody.password = "********";
      logger.debug("  Request Body:", logBody);
    }
  }

  return null; // Morgan doesn't need to print directly; we use Winston
});
