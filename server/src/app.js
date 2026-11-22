import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpecification from "./config/swagger.js";
import connectDB from "./config/db.js"; // named export ho to: import { connectDB } from ...
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";
import ApiResponse from "./utils/ApiResponse.js";
import { env } from "./config/env.js";

const app = express();

if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

/* ---------- CORS ---------- */
const normalizeOrigin = (url) => {
  try {
    return new URL(url).origin; // peeche ka "/" apne aap hat jaata hai
  } catch {
    return "";
  }
};

// Ek baar bana lo, har request par dobara nahi
const allowedOrigins = new Set(
  [
    normalizeOrigin(env.clientUrl),
    ...(process.env.CLIENT_URLS || "")
      .split(",")
      .map((url) => normalizeOrigin(url.trim())),
  ].filter(Boolean),
);

const isLocalDev = (origin) => {
  if (env.nodeEnv === "production") return false;
  try {
    const { protocol, hostname } = new URL(origin);
    return (
      protocol === "http:" && ["localhost", "127.0.0.1"].includes(hostname)
    );
  } catch {
    return false;
  }
};

app.use(
  cors({
    origin(origin, callback) {
      // Postman, curl, server-to-server requests mein Origin nahi hota
      if (!origin) return callback(null, true);

      if (allowedOrigins.has(normalizeOrigin(origin)) || isLocalDev(origin)) {
        return callback(null, true);
      }

      console.warn("CORS blocked origin:", origin); // Logs mein asli origin dikhega
      return callback(null, false); // Error throw mat karo
    },
    credentials: true,
  }),
);

/* ---------- Baaki middlewares ---------- */
app.use(helmet());
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

/* ---------- Bina DB wale routes ---------- */
app.get("/health", (_req, res) => {
  res.status(200).json(new ApiResponse(200, "Service is healthy."));
});

app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpecification);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

/* ---------- DB connect (sirf API routes ke liye) ---------- */
const ensureDB = async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};

app.use("/api/v1", ensureDB, apiRoutes);
app.use("/auth", ensureDB, authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
