import { body, param } from "express-validator";

export const createApiKeyValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
];

export const apiKeyIdValidation = [param("id").isMongoId().withMessage("Invalid API Key ID")];
