import express from "express";

const incidentRouter = express.Router();

import validate from "../../middlewares/validate.middleware.js";
import { org_user_Auth } from "../auth/auth.middleware.js";

import {
  createIncident,
  assignIncident,
  updateIncidentStatus,
  resolveIncident,
  addIncidentLog,
  getIncident,
  getAllIncidents,
} from "./incident.controller.js";

import {
  createIncidentSchema,
  assignIncidentSchema,
  updateStatusSchema,
  addLogSchema,
} from "./incident.schema.js";

incidentRouter.post("/create", createIncidentSchema, validate, createIncident);

incidentRouter.get("/all", org_user_Auth, getAllIncidents);

incidentRouter.get("/get/:id", org_user_Auth, getIncident);

incidentRouter.patch("/assign/:id", org_user_Auth, assignIncidentSchema, validate, assignIncident);

incidentRouter.patch(
  "/status/:id",
  org_user_Auth,
  updateStatusSchema,
  validate,
  updateIncidentStatus,
);

incidentRouter.patch("/resolve/:id", org_user_Auth, resolveIncident);

incidentRouter.post("/log/:id", org_user_Auth, addLogSchema, validate, addIncidentLog);

export default incidentRouter;
