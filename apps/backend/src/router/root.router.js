import express from "express";
import Auth_router from "../modules/auth/Auth.route.js";
import ApiKey_router from "../modules/apiKey/apiKey.route.js";

const rootRouter = express.Router();

// Auth routes
rootRouter.use("/auth", Auth_router);
rootRouter.use("/api-keys", ApiKey_router);

// Add more routes here as you expand

export default rootRouter;
