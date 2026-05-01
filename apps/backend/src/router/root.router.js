import express from "express";
import Auth_router from "../modules/auth/Auth.route.js";
import ApiKey_router from "../modules/apiKey/apiKey.route.js";
import statusRouter from "../modules/status/status.route.js";
import Invite_router from "../modules/invite/Invite.route.js";

const rootRouter = express.Router();

// Auth routes
rootRouter.use("/auth", Auth_router);
rootRouter.use("/api-keys", ApiKey_router);
rootRouter.use("/status", statusRouter);
rootRouter.use("/", Invite_router);

// Add more routes here as you expand

export default rootRouter;
