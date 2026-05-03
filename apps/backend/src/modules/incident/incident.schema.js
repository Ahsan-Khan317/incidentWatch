import { body } from "express-validator";

export const createIncidentSchema = [
  body("title").notEmpty().withMessage("Title is required"),

  body("severity")
    .optional()
    .isIn(["low", "medium", "high", "SEV1", "SEV2", "SEV3"])
    .withMessage("Invalid severity"),
];

export const assignIncidentSchema = [
  body("assignedTo").notEmpty().withMessage("assignedTo is required"),
];

export const updateStatusSchema = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["open", "acknowledged", "resolved"])
    .withMessage("Invalid status"),
];

export const addLogSchema = [body("log").notEmpty().withMessage("Log is required")];
