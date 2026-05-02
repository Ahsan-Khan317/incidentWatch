import { body } from "express-validator";

export const createPostmortemSchema = [
  body("summary").notEmpty().withMessage("Summary is required"),

  body("rootCause").notEmpty().withMessage("Root cause is required"),

  body("resolution").notEmpty().withMessage("Resolution is required"),

  body("prevention").notEmpty().withMessage("Prevention is required"),
];

export const updatePostmortemSchema = [
  body("summary").optional().notEmpty(),

  body("rootCause").optional().notEmpty(),

  body("resolution").optional().notEmpty(),

  body("prevention").optional().notEmpty(),
];
