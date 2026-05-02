import { body, query, param } from "express-validator";

export const createLogSchema = [
  body().custom((value, { req }) => {
    // API Key is mandatory for log ingestion
    if (!req.headers["x-api-key"] && !req.user) {
      throw new Error("Authentication required (API Key or JWT)");
    }

    const { message, title, level, severity } = req.body;

    // Check for message/title
    if ((!message || message.trim() === "") && (!title || title.trim() === "")) {
      throw new Error("Log must have a message or title");
    }

    // Check for level/severity
    if (!level && !severity) {
      throw new Error("Log must have a level or severity");
    }

    return true;
  }),
  body("title").optional().isString().trim().notEmpty().withMessage("Title cannot be empty"),
  body("message").optional().isString().trim().notEmpty().withMessage("Message cannot be empty"),
  body("severity")
    .optional()
    .isIn(["SEV1", "SEV2", "SEV3"])
    .withMessage("Severity must be SEV1, SEV2, or SEV3"),
  body("level")
    .optional()
    .isIn(["info", "warn", "error"])
    .withMessage("Level must be info, warn, or error"),
  body("service").optional().isString().trim(),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("context").optional().isObject().withMessage("Context must be an object"),
  body("breadcrumbs").optional().isArray().withMessage("Breadcrumbs must be an array"),
  body("meta").optional().isObject(),
];

export const getLogsSchema = [
  query("level").optional().isIn(["info", "warn", "error"]).withMessage("Invalid filter level"),
  query("service").optional().trim(),
];

export const logIdSchema = [param("id").isMongoId().withMessage("Invalid Log ID")];
