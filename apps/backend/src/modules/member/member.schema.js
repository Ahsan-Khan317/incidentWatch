import { body, param } from "express-validator";

export const updateMemberRoleSchema = [
  param("id").isMongoId().withMessage("Invalid member ID"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "developer", "tester", "viewer"])
    .withMessage("Invalid role. Allowed roles: admin, developer, tester, viewer"),
];

export const memberIdSchema = [param("id").isMongoId().withMessage("Invalid member ID")];
