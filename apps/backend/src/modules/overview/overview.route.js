import express from "express";
import { getOverviewMetrics } from "./overview.controller.js";
import { org_user_Auth } from "@/modules/auth/auth.middleware.js";

const overviewRouter = express.Router();

// Protected route
overviewRouter.get("/metrics", org_user_Auth, getOverviewMetrics);

export default overviewRouter;
