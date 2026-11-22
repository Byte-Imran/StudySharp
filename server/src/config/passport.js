import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import "./env.js";
import User from "../models/user.model.js";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, _refreshToken, profile, done) => {
      try {
        let email = profile.emails?.find((item) => item.verified)?.value ||
          profile.emails?.[0]?.value;

        if (!email) {
          const response = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/vnd.github+json",
              "X-GitHub-Api-Version": "2022-11-28",
              "User-Agent": "studySharp",
            },
          });

          if (response.ok) {
            const emails = await response.json();
            email = emails.find((item) => item.primary && item.verified)?.email ||
              emails.find((item) => item.verified)?.email ||
              emails[0]?.email;
          }
        }

        email = email?.trim().toLowerCase();
        if (!email) {
          return done(null, false, {
            message: "GitHub email is not available. Please add a public or verified email.",
          });
        }

        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          user = await User.findOne({ email });
          if (user) {
            user.githubId = profile.id;
            user.img = user.img || profile.photos?.[0]?.value;
            await user.save();
          }
        }

        if (!user) {
          user = await User.create({
            githubId: profile.id,
            email,
            name: profile.displayName || profile.username || email.split("@")[0],
            img: profile.photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const verified = profile._json?.email_verified;

        if (!email || !verified) {
          return done(null, false, { message: "Google email not verified" });
        }

        // 1) googleId se dhoondo
        let user = await User.findOne({ googleId: profile.id });

        // 2) nahi mila to email se dhoondo aur purane account ko link karo
        if (!user) {
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            user.img = user.img || profile.photos?.[0]?.value;
            await user.save();
          }
        }

        // 3) bilkul naya user
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email,
            name: profile.displayName,
            img: profile.photos?.[0]?.value,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

export default passport;
