import { captureIncident, handleHeartbeat, verifyKey } from "./sdk.controller.js";
import { sdkAuth } from "@/middlewares/sdkAuth.middleware.js";
import express from "express";

const sdkRouter = express.Router();

// All SDK routes require API key authentication
sdkRouter.use(sdkAuth);

sdkRouter.post("/incidents", captureIncident);
sdkRouter.post("/heartbeat", handleHeartbeat);
sdkRouter.get("/verify", verifyKey);

export default sdkRouter;
