/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Async handler to wrap express routes and catch errors automatically
 * @param {function(Request, Response, NextFunction): Promise<any>} requestHandler
 * @returns {function(Request, Response, NextFunction): void}
 */
export const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
