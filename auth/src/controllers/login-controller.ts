import passport from "passport";
import { NextFunction, Request, Response } from "express";

export const loginController = async (req: Request, res: Response, next:NextFunction) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.status(401).json({ message: "Incorrect username or password" });
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res
            .status(200)
            .json({ message: "Successfully Authenticated",  user });
        });
      }
    })(req, res, next);
  };
  