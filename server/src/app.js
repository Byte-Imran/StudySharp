import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpecification from "./config/swagger.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import apiRoutes from "./routes/index.js";
import ApiResponse from "./utils/ApiResponse.js";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
const app = express();
if (env.nodeEnv === "production") {
  app.set("trust proxy", 1);
}
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      let requestUrl;
      try {
        requestUrl = new URL(origin);
      } catch {
        return callback(new Error("Origin is not allowed by CORS."));
      }

      const normalizeOrigin = (url) => {
        try {
          return new URL(url).origin;
        } catch {
          return "";
        }
      };

      const allowedOrigins = [
        normalizeOrigin(env.clientUrl),
        ...(process.env.CLIENT_URLS || "")
          .split(",")
          .map((url) => normalizeOrigin(url.trim()))
          .filter(Boolean),
      ];

      if (allowedOrigins.includes(requestUrl.origin)) {
        return callback(null, true);
      }

      if (
        env.nodeEnv === "production" &&
        process.env.VERCEL &&
        requestUrl.protocol === "https:" &&
        requestUrl.hostname.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      if (env.nodeEnv !== "production") {
        const { hostname, protocol } = requestUrl;
        if (
          protocol === "http:" &&
          ["localhost", "127.0.0.1"].includes(hostname)
        ) {
          return callback(null, true);
        }
      }

      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.get("/health", (_req, res) => {
  res.status(200).json(new ApiResponse(200, "Service is healthy."));
});

app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpecification);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

app.use("/api/v1", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
