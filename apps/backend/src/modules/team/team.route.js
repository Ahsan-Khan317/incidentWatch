import express from "express";
import { getTeams, createTeam, updateTeam, deleteTeam } from "./team.controller.js";
import { org_user_Auth } from "@/modules/auth/auth.middleware.js";

const teamRouter = express.Router();

teamRouter.use(org_user_Auth);

teamRouter.get("/", getTeams);
teamRouter.post("/", createTeam);
teamRouter.patch("/:id", updateTeam);
teamRouter.delete("/:id", deleteTeam);

export default teamRouter;
