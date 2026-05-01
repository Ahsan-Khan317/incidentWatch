import { body, query, param } from "express-validator";

export const createLogSchema = [
  body("message").notEmpty().withMessage("Message is required").trim(),
  body("level")
    .notEmpty()
    .withMessage("Level is required")
    .isIn(["info", "warn", "error"])
    .withMessage("Level must be one of: info, warn, error"),
  body("service").optional().isString().trim(),
  body("meta").optional().isObject(),
];

export const getLogsSchema = [
  query("level").optional().isIn(["info", "warn", "error"]).withMessage("Invalid filter level"),
  query("service").optional().trim(),
];

export const logIdSchema = [param("id").isMongoId().withMessage("Invalid Log ID")];
