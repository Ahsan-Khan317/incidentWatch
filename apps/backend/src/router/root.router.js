import express from "express";
import Auth_router from "../modules/auth/Auth.route.js";
import ApiKey_router from "../modules/apiKey/apiKey.route.js";
import statusRouter from "../modules/status/status.route.js";
import Invite_router from "../modules/invite/Invite.route.js";
import Member_router from "../modules/member/Member.route.js";
import postmortemRouter from "@/modules/posmortem/postmortem.route.js";
import incidentRouter from "@/modules/incident/incident.route.js";
import logsRouter from "../modules/logs/logs.route.js";

const rootRouter = express.Router();

// Auth routes
rootRouter.use("/auth", Auth_router);
rootRouter.use("/api-keys", ApiKey_router);
rootRouter.use("/status", statusRouter);
rootRouter.use("/members", Member_router);
rootRouter.use("/logs", logsRouter);
rootRouter.use("/", Invite_router);
rootRouter.use("/incident", incidentRouter);
rootRouter.use("/postmortem", postmortemRouter);

// Add more routes here as you expand

export default rootRouter;
