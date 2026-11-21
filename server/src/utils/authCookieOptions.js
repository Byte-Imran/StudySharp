import { env } from "../config/env.js";

const isProduction =
  env.nodeEnv === "production" ||
  Boolean(process.env.VERCEL) ||
  Boolean(process.env.RENDER) ||
  Boolean(process.env.RAILWAY_ENVIRONMENT);

const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export default authCookieOptions;
