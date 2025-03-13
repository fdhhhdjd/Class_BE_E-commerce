const passport = require("passport");
const authConfig = require("../configs/auth.conf");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: authConfig.Google.ClientId,
      clientSecret: authConfig.Google.ClientSecret,
      callbackURL: authConfig.Google.CallbackUrl,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Serialize và Deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
