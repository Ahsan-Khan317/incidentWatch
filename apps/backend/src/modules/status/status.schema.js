import { body, param } from "express-validator";

export const createStatusValidation = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("severity")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid severity level"),

  body("status")
    .optional()
    .isIn(["open", "in-progress", "resolved"])
    .withMessage("Invalid status level"),
];

export const updateStatusValidation = [
  param("id").isMongoId().withMessage("Invalid status ID"),
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("severity")
    .optional()
    .isIn(["low", "medium", "high", "critical"])
    .withMessage("Invalid severity level"),
  body("status")
    .optional()
    .isIn(["open", "in-progress", "resolved"])
    .withMessage("Invalid status level"),
];

export const statusIdValidation = [param("id").isMongoId().withMessage("Invalid status ID")];
