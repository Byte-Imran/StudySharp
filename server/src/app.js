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
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || origin === env.clientUrl) {
        return callback(null, true);
      }

      if (env.nodeEnv !== "production") {
        try {
          const { hostname, protocol } = new URL(origin);
          if (
            protocol === "http:" &&
            ["localhost", "127.0.0.1"].includes(hostname)
          ) {
            return callback(null, true);
          }
        } catch {
          return callback(new Error("Invalid request origin."));
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
