import express from "express";
import { getTeams, createTeam, updateTeam, deleteTeam } from "./team.controller.js";
import { org_user_Auth } from "../auth/auth.middleware.js";
import { createTeamSchema, updateTeamSchema } from "./team.schema.js";
import validate from "../../middlewares/validate.middleware.js";

const teamRouter = express.Router();

teamRouter.use(org_user_Auth);

teamRouter.get("/", getTeams);
teamRouter.post("/", createTeamSchema, validate, createTeam);
teamRouter.patch("/:id", updateTeamSchema, validate, updateTeam);
teamRouter.delete("/:id", deleteTeam);

export default teamRouter;
