import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "./env.js";
import User from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
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
