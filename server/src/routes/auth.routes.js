import { Router } from "express";
import crypto from "crypto";
import { env } from "../config/env.js";
import passport from "../config/passport.js";
import { googleCallback } from "../controllers/auth.controller.js";

const router = Router();
const isProd = env.nodeEnv === "production";

const stateCookie = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 10 * 60 * 1000,
};

// Step 1: Google par bhejo
router.get("/google", (req, res, next) => {
  const state = crypto.randomBytes(16).toString("hex");
  res.cookie("oauth_state", state, stateCookie);

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
    state,
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
    })(req, res, next);
  },
  googleCallback,
);

export default router;
