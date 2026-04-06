const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { findOrCreateGoogleUser } = require("../models/authModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await findOrCreateGoogleUser({
          email: profile.emails[0].value,
          name: profile.displayName,
          profileImage: profile.photos?.[0]?.value ?? null,
        });
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.user_id));
passport.deserializeUser((user_id, done) => done(null, { user_id }));

module.exports = passport;