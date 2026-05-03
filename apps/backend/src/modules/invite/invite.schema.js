import { body } from "express-validator";

export const inviteMemberSchema = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("role")
    .optional()
    .isIn(["admin", "developer", "tester", "viewer"])
    .withMessage("Invalid role"),
  body("expertise").optional().isArray().withMessage("Expertise must be an array"),
  body("tier").optional().isNumeric().withMessage("Tier must be a number"),
  body("avatarColor").optional().isString().withMessage("Avatar color must be a string"),
];
