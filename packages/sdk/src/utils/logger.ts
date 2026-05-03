import winston from "winston";
import { SDKConfig } from "../types";

export function createLogger(config: SDKConfig): winston.Logger {
  const { combine, timestamp, errors, json, colorize, printf } = winston.format;

  // ── Dev-friendly format (local development) ───────────────────────────
  const devFormat = combine(
    colorize({ all: true }),
    timestamp({ format: "HH:mm:ss" }),
    errors({ stack: true }),
    printf(({ level, message, timestamp, ...meta }) => {
      const metaStr = Object.keys(meta).length
        ? " " + JSON.stringify(meta)
        : "";
      return `${timestamp} [IW] ${level}: ${message}${metaStr}`;
    }),
  );

  // ── Production format (JSON — easy to parse / ship) ───────────────────
  const prodFormat = combine(timestamp(), errors({ stack: true }), json());

  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: config.logger.prettyPrint ? devFormat : prodFormat,
    }),
  ];

  // Optional: file transport
  if (config.logger.filePath) {
    transports.push(
      new winston.transports.File({
        filename: config.logger.filePath,
        format: prodFormat,
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
        tailable: true,
      }),
    );
  }

  const logger = winston.createLogger({
    level: config.logger.level,
    defaultMeta: {
      serverId: config.serverId,
      environment: config.environment,
      release: config.release,
      _iw: true, // Internal marker to prevent infinite recursion in terminal capture
    },
    transports,
    // Unhandled exceptions ko logger catch kare (hooks.js bhi karta hai but backup)
    exceptionHandlers: [new winston.transports.Console({ format: devFormat })],
    exitOnError: false,
  });

  return logger;
}
