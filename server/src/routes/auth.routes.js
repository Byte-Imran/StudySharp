import { Router } from "express";
import crypto from "crypto";
import { env } from "../config/env.js";
import passport from "../config/passport.js";
import {
  googleCallback,
  githubCallback,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { getCurrentUser } from "../controllers/user.controller.js";

const router = Router();
const isProd =
  env.nodeEnv === "production" ||
  Boolean(process.env.VERCEL) ||
  Boolean(process.env.RENDER) ||
  Boolean(process.env.RAILWAY_ENVIRONMENT);

const stateCookie = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 10 * 60 * 1000,
};

const getPublicServerUrl = (req) => {
  if (env.serverUrl) return env.serverUrl;

  const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
  const protocol = forwardedProto || req.protocol;
  const host = forwardedHost || req.get("host");

  return host ? `${protocol}://${host}` : "";
};

const getOAuthBasePath = (req) => {
  if (req.baseUrl) return req.baseUrl;
  return "/api/v1/auth";
};

// Step 1: Google par bhejo
router.get("/google", (req, res, next) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("oauth_state", state, stateCookie);

  const publicServerUrl = getPublicServerUrl(req);
  const callbackURL =
    (env.serverUrl && `${env.serverUrl}/api/v1/auth/google/callback`) ||
    (publicServerUrl && `${publicServerUrl}/api/v1/auth/google/callback`) ||
    process.env.GOOGLE_CALLBACK_URL;

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
    state,
    callbackURL,
  })(req, res, next);
});

// Step 2: Google yahan wapas bhejta hai
router.get(
  "/google/callback",
  (req, res, next) => {
    const failUrl = new URL("/login", env.clientUrl);
    failUrl.searchParams.set("error", "oauth_failed");

    if (!req.query.state || req.query.state !== req.cookies.oauth_state) {
      res.clearCookie("oauth_state", stateCookie);
      return res.redirect(failUrl.toString());
    }
    res.clearCookie("oauth_state", stateCookie);

    passport.authenticate("google", {
      session: false,
      failureRedirect: failUrl.toString(),
      callbackURL:
        (env.serverUrl && `${env.serverUrl}/api/v1/auth/google/callback`) ||
        (getPublicServerUrl(req) &&
          `${getPublicServerUrl(req)}/api/v1/auth/google/callback`) ||
        process.env.GOOGLE_CALLBACK_URL,
    })(req, res, next);
  },
  googleCallback,
);

router.get("/me", verifyJWT, getCurrentUser);

router.get("/github", (req, res, next) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("oauth_state", state, stateCookie);

  const publicServerUrl = getPublicServerUrl(req);
  const oauthBasePath = getOAuthBasePath(req);
  const callbackURL =
    (env.serverUrl && `${env.serverUrl}${oauthBasePath}/github/callback`) ||
    (publicServerUrl && `${publicServerUrl}${oauthBasePath}/github/callback`) ||
    process.env.GITHUB_CALLBACK_URL;

  passport.authenticate("github", {
    scope: ["user:email"],
    session: false,
    state,
    callbackURL,
  })(req, res, next);
});

router.get(
  "/github/callback",
  (req, res, next) => {
    const failUrl = new URL("/login", env.clientUrl);
    failUrl.searchParams.set("error", "oauth_failed");

    if (!req.query.state || req.query.state !== req.cookies.oauth_state) {
      res.clearCookie("oauth_state", stateCookie);
      return res.redirect(failUrl.toString());
    }
    res.clearCookie("oauth_state", stateCookie);

    passport.authenticate("github", {
      session: false,
      failureRedirect: failUrl.toString(),
      callbackURL:
        (env.serverUrl &&
          `${env.serverUrl}${getOAuthBasePath(req)}/github/callback`) ||
        (getPublicServerUrl(req) &&
          `${getPublicServerUrl(req)}${getOAuthBasePath(req)}/github/callback`) ||
        process.env.GITHUB_CALLBACK_URL,
    })(req, res, next);
  },
  githubCallback,
);

export default router;
