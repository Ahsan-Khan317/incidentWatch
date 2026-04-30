import { verifyAccessToken } from "../services/token.service.js";
import { ApiError } from "../../../utils/Error/ApiError.js";

/**
 * Verify access token and attach user to request
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
export const org_user_Auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "Unauthorized access"));
    }

    const token = authHeader.split(" ")[1];
    const decode = verifyAccessToken(token);

    if (!decode) {
      return next(new ApiError(401, "Invalid or expired token"));
    }

    req.user = decode;
    next();
  } catch (error) {
    return next(new ApiError(401, "Authentication failed"));
  }
};

/**
 * Verify access token and check for admin role
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
export const org_admin_Auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new ApiError(401, "Unauthorized access"));
    }

    const token = authHeader.split(" ")[1];
    const decode = verifyAccessToken(token);

    if (!decode) {
      return next(new ApiError(401, "Invalid or expired token"));
    }

    if (decode.role !== "admin") {
      return next(new ApiError(403, "Admin access required"));
    }

    req.user = decode;
    next();
  } catch (error) {
    return next(new ApiError(401, "Authentication failed"));
  }
};

export default {
  org_user_Auth,
  org_admin_Auth,
};
