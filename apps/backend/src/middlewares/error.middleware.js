import { ApiError } from "@/utils/Error/ApiError.js";
import { ENV } from "@/configs/env.config.js";

/**
 * Global Error Handler Middleware
 * Catches all errors passed to next() and formats them into a consistent ApiResponse.
 */
export const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  // Log the error for debugging
  if (ENV.NODE_ENV === "development") {
    console.error("❌ Error caught by Global Handler:");
    console.error(err);
  }

  // Convert standard errors/Mongoose errors to our custom ApiError format
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    // Handle specific native JS errors for better clarity
    if (error instanceof ReferenceError) {
      message = `Programming Error: ${error.message}`;
    } else if (error instanceof TypeError) {
      message = `Type Error: ${error.message}`;
    } else if (error.name === "ValidationError") {
      // Handle Mongoose validation errors
      statusCode = 400;
    }

    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    success: false, // Ensure success is always false for errors
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    // Send stack trace only in development to avoid leaking internal info in production
    ...(ENV.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};
