import express from "express";
import {
  createStatus,
  getAllStatus,
  getStatusById,
  updateStatus,
  deleteStatus,
  getStreamStatus,
} from "./status.controller.js";
import {
  createStatusValidation,
  updateStatusValidation,
  statusIdValidation,
} from "./status.schema.js";
import validate from "../../middlewares/validate.middleware.js";
import { org_user_Auth } from "../auth/auth.middleware.js";

const statusRouter = express.Router();

// Apply auth middleware to all routes in this router
statusRouter.use(org_user_Auth);

statusRouter.post("/create", createStatusValidation, validate, createStatus);
statusRouter.get("/all", getAllStatus);
statusRouter.get("/stream", getStreamStatus);
statusRouter.get("/:id", statusIdValidation, validate, getStatusById);
statusRouter.put("/:id", updateStatusValidation, validate, updateStatus);
statusRouter.delete("/:id", statusIdValidation, validate, deleteStatus);

export default statusRouter;
