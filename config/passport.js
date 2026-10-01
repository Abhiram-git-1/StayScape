const passport = require("passport");

const LocalStrategy = require("passport-local");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/user");

//LOCAL STRATEGY
console.log(process.env.GOOGLE_CLIENT_ID);
passport.use(new LocalStrategy(User.authenticate()));
//SESSION
passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());
//  GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/users/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Existing Google user
        let user = await User.findOne({
          googleId: profile.id,
        });

        if (user) {
          return done(null, user);
        }

        //EMAIL CHECK

        const existingEmailUser = await User.findOne({
          email: profile.emails[0].value,
        });

        // Link Google account
        if (existingEmailUser) {
          existingEmailUser.googleId = profile.id;

          existingEmailUser.isVerified = true;

          existingEmailUser.profilePicture = profile.photos[0].value;

          await existingEmailUser.save();

          return done(null, existingEmailUser);
        }
        //CREATE USER

        const usernameBase = profile.displayName
          .replace(/\s+/g, "")
          .toLowerCase();

        let username = usernameBase;

        let counter = 1;

        // Prevent username collisions
        while (
          await User.findOne({
            username,
          })
        ) {
          username = `${usernameBase}${counter}`;

          counter++;
        }

        const newUser = new User({
          username,

          email: profile.emails[0].value,

          googleId: profile.id,

          profilePicture: profile.photos[0].value,

          isVerified: true,
        });

        await newUser.save();

        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

module.exports = passport;
