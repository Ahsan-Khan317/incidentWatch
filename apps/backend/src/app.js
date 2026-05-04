import { API_PREFIX } from "@/constants/index.js";
import { globalErrorHandler } from "@/middlewares/error.middleware.js";
import { ApiError } from "@/utils/Error/ApiError.js";
import cookieParser from "cookie-parser";
import express from "express";
import { loggerMiddleware } from "./middlewares/ApiLogger.middleware.js";
import { corsMiddleware } from "./middlewares/cors.middleware.js";
import rootRouter from "./router/root.router.js";

const app = express();
// app.use(loggerMiddleware);
app.use(corsMiddleware);
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parsing
app.use(cookieParser());

// Setup global API prefix with root router
app.use("/health", (req, res, next) => {
  res.json({ message: "Welcome to the IncidentWatch API!" });
});
app.use(API_PREFIX, rootRouter);

// 404 Route Handler - catches requests to non-existent API routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`, []));
});

// Express v5 Global Error Middleware - executes sequentially catching anything thrown or passed to Next()
app.use(globalErrorHandler);

export default app;
