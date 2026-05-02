import { validationResult } from "express-validator";
import { ApiError } from "@/utils/Error/ApiError.js";

// Global validation error handler (for express-validator)
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors
      .array()
      .map((e) => e.msg)
      .join(" , ");
    return next(new ApiError(400, msg));
  }
  next();
};
export default validate;
