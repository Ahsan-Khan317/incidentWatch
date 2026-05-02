import express from "express";

const postmortemRouter = express.Router();

import validate from "../../middlewares/validate.middleware.js";

import {
  createPostmortem,
  getPostmortem,
  updatePostmortem,
  deletePostmortem,
} from "./postmortem.controller.js";

import { createPostmortemSchema, updatePostmortemSchema } from "./postmortem.schema.js";

postmortemRouter.post("/:incidentId/create", createPostmortemSchema, validate, createPostmortem);

postmortemRouter.get("/get/:incidentId", getPostmortem);

postmortemRouter.patch("/update/:id", updatePostmortemSchema, validate, updatePostmortem);

postmortemRouter.delete("/delete/:id", deletePostmortem);

export default postmortemRouter;
