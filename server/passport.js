const passport = require("passport");
const googleUser = require("./models/googleUser");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      console.log("Session in Google OAuth:", req.session);  // Add log for debugging
      const accountType = req.session.accountType;

      console.log("Session accountType:", req.session.accountType); 
      

      if (!accountType) {
        return done(new Error("Account type is missing."));
      }

      const existingUser = await googleUser.findOne({
        email: profile.emails[0].value,
      });
      if (existingUser) {
        return done(null, existingUser);
      }
      const newUser = new googleUser({
        googleId: profile.id,
        email: profile.emails[0].value,
        firstName: profile.given_name,
        lastName: profile.family_name,
        accountType: accountType,
      });
      await newUser.save();
      done(null, newUser);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
  try {
    const user = await GoogleUser.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
