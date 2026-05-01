import express from "express";
import { createLog, getAllLogs, getLogById } from "./logs.controller.js";
import { createLogSchema, getLogsSchema, logIdSchema } from "./logs.schema.js";
import validate from "../../middlewares/validate.middleware.js";
import { org_user_Auth } from "../auth/auth.middleware.js";

const logsRouter = express.Router();

/**
 * Custom middleware to allow either API Key or JWT for log creation.
 */
const logAuth = (req, res, next) => {
  if (req.headers["x-api-key"]) {
    return next();
  }
  // Fallback to standard auth
  return org_user_Auth(req, res, next);
};

// POST /logs - Create Log (API Key or JWT)
logsRouter.post("/", logAuth, createLogSchema, validate, createLog);

// All other routes require JWT Auth
logsRouter.use(org_user_Auth);

// GET /logs - Get All Logs (JWT)
logsRouter.get("/", getLogsSchema, validate, getAllLogs);

// GET /logs/:id - Get Single Log (JWT)
logsRouter.get("/:id", logIdSchema, validate, getLogById);

export default logsRouter;
