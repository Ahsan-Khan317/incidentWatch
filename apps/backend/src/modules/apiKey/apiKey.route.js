import express from "express";
import {
  createApiKey,
  getAllApiKeys,
  getApiKeyById,
  regenerateApiKey,
  deleteApiKey,
  toggleApiKeyStatus,
} from "./apiKey.controller.js";
import { createApiKeyValidation, apiKeyIdValidation } from "./apiKey.schema.js";
import validate from "../../middlewares/validate.middleware.js";
import { org_admin_Auth } from "../auth/auth.middleware.js";

const apiKeyRouter = express.Router();

// Apply admin auth middleware to all routes in this router
apiKeyRouter.use(org_admin_Auth);

apiKeyRouter.post("/create", createApiKeyValidation, validate, createApiKey);
apiKeyRouter.get("/all", getAllApiKeys);
apiKeyRouter.get("/:id", apiKeyIdValidation, validate, getApiKeyById);
apiKeyRouter.put("/:id/regenerate", apiKeyIdValidation, validate, regenerateApiKey);
apiKeyRouter.patch("/:id/toggle-status", apiKeyIdValidation, validate, toggleApiKeyStatus);
apiKeyRouter.delete("/:id", apiKeyIdValidation, validate, deleteApiKey);

export default apiKeyRouter;
