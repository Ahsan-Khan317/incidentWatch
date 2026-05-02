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
];

export const acceptInviteSchema = [
  body("token").notEmpty().withMessage("Invitation token is required"),
  body("name").notEmpty().withMessage("Name is required").trim(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];
