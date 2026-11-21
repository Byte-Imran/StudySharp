import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import { env } from "../config/env.js";

export function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, _req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode ?? error.status ?? 500;
  let message = error.message || "Internal server error.";
  let details = error.details;

  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Request validation failed.";
    details = Object.values(error.errors).map(
      (validationError) => validationError.message,
    );
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "The supplied value is invalid.";
  } else if (error.code === 11000) {
    statusCode = 409;
    message = "A record with that value already exists.";
  }

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message:
      env.nodeEnv === "production" && statusCode >= 500
        ? "Internal server error."
        : message,
    ...(details ? { details } : {}),
    ...(env.nodeEnv !== "production" && statusCode >= 500
      ? { stack: error.stack }
      : {}),
  });
}
