import { env } from "../config/env.js";

const isProduction = env.nodeEnv === "production";

const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export default authCookieOptions;
