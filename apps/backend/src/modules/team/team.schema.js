import { body } from "express-validator";

export const createTeamSchema = [
  body("name")
    .notEmpty()
    .withMessage("Team name is required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Team name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be under 200 characters"),

  body("color")
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage("Invalid color hex"),

  body("members").optional().isArray().withMessage("members must be an array of IDs"),

  body("members.*").isString().withMessage("Member ID must be a string"),
];

export const updateTeamSchema = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Team name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description must be under 200 characters"),

  body("color")
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage("Invalid color hex"),

  body("members").optional().isArray().withMessage("members must be an array of IDs"),

  body("members.*").isString().withMessage("Member ID must be a string"),
];
