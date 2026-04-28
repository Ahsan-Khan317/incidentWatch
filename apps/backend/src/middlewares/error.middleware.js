import { ApiError } from "@/utils/ApiError.js";
import { ENV } from "@/configs/env.config.js";

export const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  // Convert standard errors/Mongoose errors to our custom ApiError format
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode ? error.statusCode : 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: error.success,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors,
    // Send stack trace only in development
    ...(ENV.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};
