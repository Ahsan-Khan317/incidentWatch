import winston from "winston";
import chalk from "chalk";

/**
 * Custom log levels for IncidentWatch
 */
const levels = {
  error: 0,
  warn: 1,
  success: 2,
  info: 3,
  debug: 4,
};

/**
 * Level colors using chalk for terminal visibility
 */
const colors = {
  error: "red",
  warn: "yellow",
  success: "green",
  info: "blue",
  debug: "magenta",
};

/**
 * Winston configuration for production-grade logging
 */
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf((info) => {
    const level = info.level.toUpperCase();
    const color = colors[info.level] || "white";
    const timestamp = chalk.gray(`[${info.timestamp}]`);

    // Create colored label with fixed width for alignment
    const label = chalk[color].bold(`[${level}]`.padEnd(9));

    let message = `${timestamp} ${label} ${info.message}`;

    // Add stack trace if it's an error and available
    if (info.stack) {
      message += `\n${chalk.red(info.stack)}`;
    } else if (info.details) {
      message += `\n${chalk.dim(JSON.stringify(info.details, null, 2))}`;
    }

    return message;
  }),
);

const transports = [
  new winston.transports.Console(),
  // For production, you might want to add file logging
  // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  // new winston.transports.File({ filename: 'logs/all.log' }),
];

const winstonLogger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  levels,
  format,
  transports,
});

/**
 * Unified Logger API wrapper
 */
export const logger = {
  error: (msg, error) => {
    if (error instanceof Error) {
      winstonLogger.error(msg, { stack: error.stack });
    } else {
      winstonLogger.error(msg, { details: error });
    }
  },
  warn: (msg, details) => winstonLogger.warn(msg, { details }),
  success: (msg, details) => winstonLogger.log("success", msg, { details }),
  info: (msg, details) => winstonLogger.info(msg, { details }),
  debug: (msg, details) => winstonLogger.debug(msg, { details }),
};
