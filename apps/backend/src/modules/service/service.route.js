import express from "express";
import {
  getServices,
  getServiceDetails,
  createService,
  updateService,
  deleteService,
} from "./service.controller.js";
import { org_user_Auth } from "@/modules/auth/auth.middleware.js";
import validate from "../../middlewares/validate.middleware.js";
import { createServiceSchema, updateServiceSchema } from "./service.schema.js";

const serviceRouter = express.Router();

// All service routes require user authentication
serviceRouter.use(org_user_Auth);

serviceRouter.get("/", getServices);
serviceRouter.get("/:name", getServiceDetails);
serviceRouter.post("/", createServiceSchema, validate, createService);
serviceRouter.patch("/:id", updateServiceSchema, validate, updateService);
serviceRouter.delete("/:id", deleteService);

export default serviceRouter;
