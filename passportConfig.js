import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import User from "./models/User.js";

const initialize = (passport) => {
  passport.use(
    new LocalStrategy.Strategy(
      { usernameField: "email" },
      (email, password, done) => {
        // console.log(email);
        User.findOne({ email: email }, (err, user) => {
          if (err) throw err;
          if (!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        });
      }
    )
  );
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      cb(err, user);
    });
  });
};

export default initialize;
