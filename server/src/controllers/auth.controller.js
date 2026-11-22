import jwt from "jsonwebtoken";
import authCookieOptions from "../utils/authCookieOptions.js";
import { env } from "../config/env.js";

export const googleCallback = (req, res) => {
  return oauthCallback(req, res);
};

export const githubCallback = (req, res) => {
  return oauthCallback(req, res);
};

export const oauthCallback = (req, res) => {
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const redirectUrl = new URL("/", env.clientUrl);
  redirectUrl.searchParams.set("oauth", "success");

  res.cookie("token", token, authCookieOptions);
  res.redirect(redirectUrl.toString());
};
