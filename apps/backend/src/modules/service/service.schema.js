import { body } from "express-validator";

export const createServiceSchema = [
  body("name")
    .notEmpty()
    .withMessage("Service name is required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Service name must be between 2 and 100 characters"),

  body("baseUrl").optional().trim().isURL().withMessage("Invalid base URL"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be under 200 characters"),

  body("environment")
    .optional()
    .isIn(["development", "staging", "production"])
    .withMessage("Invalid environment"),

  body("status").optional().isIn(["active", "inactive", "error"]).withMessage("Invalid status"),

  body("autoAssignEnabled")
    .optional()
    .isBoolean()
    .withMessage("autoAssignEnabled must be a boolean"),

  body("assignmentRules").optional().isArray().withMessage("assignmentRules must be an array"),

  body("assignmentRules.*.tagsRegex")
    .optional()
    .isString()
    .withMessage("tagsRegex must be a string"),

  body("assignmentRules.*.teams").optional().isArray().withMessage("teams must be an array of IDs"),

  body("assignmentRules.*.members")
    .optional()
    .isArray()
    .withMessage("members must be an array of IDs"),

  body("metadata").optional().isObject().withMessage("metadata must be an object"),
];

export const updateServiceSchema = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Service name must be between 2 and 100 characters"),

  body("baseUrl").optional().trim().isURL().withMessage("Invalid base URL"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be under 200 characters"),

  body("environment")
    .optional()
    .isIn(["development", "staging", "production"])
    .withMessage("Invalid environment"),

  body("status").optional().isIn(["active", "inactive", "error"]).withMessage("Invalid status"),

  body("autoAssignEnabled")
    .optional()
    .isBoolean()
    .withMessage("autoAssignEnabled must be a boolean"),

  body("assignmentRules").optional().isArray().withMessage("assignmentRules must be an array"),

  body("assignmentRules.*.tagsRegex")
    .optional()
    .isString()
    .withMessage("tagsRegex must be a string"),

  body("assignmentRules.*.teams").optional().isArray().withMessage("teams must be an array of IDs"),

  body("assignmentRules.*.members")
    .optional()
    .isArray()
    .withMessage("members must be an array of IDs"),

  body("metadata").optional().isObject().withMessage("metadata must be an object"),
];
