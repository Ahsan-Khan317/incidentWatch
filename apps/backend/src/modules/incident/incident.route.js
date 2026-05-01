import express from "express";

const incidentRouter = express.Router();

import validate from "../../middlewares/validate.middleware.js";

import {
  createIncident,
  assignIncident,
  updateIncidentStatus,
  resolveIncident,
  addIncidentLog,
  getIncident,
} from "./incident.controller.js";

import {
  createIncidentSchema,
  assignIncidentSchema,
  updateStatusSchema,
  addLogSchema,
} from "./incident.schema.js";

incidentRouter.post("/create", createIncidentSchema, validate, createIncident);

incidentRouter.get("/get/:id", getIncident);

incidentRouter.patch("/assign/:id", assignIncidentSchema, validate, assignIncident);

incidentRouter.patch("/status/:id", updateStatusSchema, validate, updateIncidentStatus);

incidentRouter.patch("/resolve/:id", resolveIncident);

incidentRouter.post("/log/:id", addLogSchema, validate, addIncidentLog);

export default incidentRouter;
