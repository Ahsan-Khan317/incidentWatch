import { verifyAccessToken } from "../..//utils/generateToken.js";
import { ApiError } from "../../utils/Error/ApiError.js";

//baseauth

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

//adminauth

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
