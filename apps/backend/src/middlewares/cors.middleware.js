import cors from "cors";
import { ENV } from "@/configs/env.config.js";

const allowedOrigins = ENV.CORS_ORIGIN;

const corsOptions = {
  origin: (requestOrigin, callback) => {
    if (!requestOrigin) {
      // Allow non-browser requests like Postman or server-to-server
      return callback(null, true);
    }

    if (allowedOrigins.includes("*") || allowedOrigins.includes(requestOrigin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS policy does not allow access from this origin."));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
    "Origin",
    "User-Agent",
  ],
  credentials: true,
  optionsSuccessStatus: 204,
};

export const corsMiddleware = cors(corsOptions);
