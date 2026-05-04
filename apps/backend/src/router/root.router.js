import express from "express";
import Auth_router from "../modules/auth/Auth.route.js";
import ApiKey_router from "../modules/apiKey/apiKey.route.js";
import statusRouter from "../modules/status/status.route.js";
import Invite_router from "../modules/invite/Invite.route.js";
import Member_router from "../modules/member/Member.route.js";
import postmortemRouter from "@/modules/posmortem/postmortem.route.js";
import incidentRouter from "@/modules/incident/incident.route.js";
import logsRouter from "../modules/logs/logs.route.js";
import sdkRouter from "../modules/sdk/sdk.route.js";
import serviceRouter from "../modules/service/service.route.js";
import teamRouter from "../modules/team/team.route.js";
import overviewRouter from "../modules/overview/overview.route.js";

const rootRouter = express.Router();

// Auth routes
rootRouter.get("/health", (req, res) => {
  res.json({ message: "Welcome to the IncidentWatch API!" });
});

rootRouter.use("/auth", Auth_router);
rootRouter.use("/api-keys", ApiKey_router);
rootRouter.use("/status", statusRouter);
rootRouter.use("/members", Member_router);
rootRouter.use("/logs", logsRouter);
rootRouter.use("/invite", Invite_router);
rootRouter.use("/incident", incidentRouter);
rootRouter.use("/postmortem", postmortemRouter);
rootRouter.use("/sdk", sdkRouter);
rootRouter.use("/services", serviceRouter);
rootRouter.use("/teams", teamRouter);
rootRouter.use("/overview", overviewRouter);

// Add more routes here as you expand

export default rootRouter;
