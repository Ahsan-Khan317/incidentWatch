import express from "express";
import cookieParser from "cookie-parser";
import { getIO } from "./socket/socket.js";
import { API_PREFIX } from "@/constants/index.js";
import rootRouter from "./router/root.router.js";
import Auth_router from "./modules/auth/Auth.route.js";
import { ENV } from "./configs/env.config.js";
import { ApiError } from "@/utils/Error/ApiError.js";
import { globalErrorHandler } from "@/middlewares/error.middleware.js";
import { corsMiddleware } from "./middlewares/cors.middleware.js";
import statusRouter from "./modules/status/status.route.js";
import apiKeyRouter from "./modules/apiKey/apiKey.route.js";

const app = express();
app.use(corsMiddleware);
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// Setup global API prefix with root router
app.use(API_PREFIX, rootRouter);

// Auth routes
app.use(`/incidentwatch`, Auth_router);
app.use(`/incidentwatch/status`, statusRouter);
app.use(`/incidentwatch/apikey`, apiKeyRouter);

app.post("/logs", (req, res) => {
  console.log("LOG:", req.body);

  const io = getIO();
  if (io) {
    io.emit("log", req.body); // realtime push
  }
  console.log(ENV.ACCESS_TOKEN_EXPIRY);
  res.send({ ok: true });
});

// 404 Route Handler - catches requests to non-existent API routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`, []));
});

// Express v5 Global Error Middleware - executes sequentially catching anything thrown or passed to Next()
app.use(globalErrorHandler);

export default app;
