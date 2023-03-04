import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import { PassportStatic } from "passport";
import { getUserByEmail, getUserById } from "./services/pg";

const initialize = (passport: PassportStatic) => {
  passport.use(
    new LocalStrategy.Strategy(
      { usernameField: "email" },
      (email, password, done) => {
        try {
          getUserByEmail(email).then(user => {
            if (!user) return done(null, false);
            bcrypt.compare(password, user.password, (err, result) => {
                  if (err) throw err;
                  if (result === true) { 
                    return done(null, user);
                  } else {
                    return done(null, false);
                  }
                })
          });
          
        } catch (error) { 
          return done(null, false);
        }
      }
    )
  );
  passport.serializeUser((user: any, cb) => {    
    cb(null, user.id);
  });
  passport.deserializeUser((id: string, cb) => {
    getUserById(id).then(user => {
      cb(null, user);
    }).catch(err => {
      cb(err, null);
    })
  });
};


export default initialize;
