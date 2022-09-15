import bcrypt from "bcrypt";
import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { createUser } from '../services/pg';



declare global {
  namespace Express {
    interface User {
      id: string,
      email: string,
      firstName: string,
      lastName: string,
    }
  }
}



export const getLogout = (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.logout();
    res.json({ message: "successfully logout", user });
  } catch (err) {
    res.json({ err: err });
  }
};


//  REGISTER
export const postRegister = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await createUser({email, firstName, lastName, hashedPassword});
    res.status(201).json({message: "Successfully user added."});
  } catch (error) {
    res.status(501).json({error});
  }
};

export const postLogin = async (req: Request, res: Response, next:NextFunction) => {
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

export const getUser = async (req: Request, res: Response) => {
  
  const { user }  = req;
  
  try {
    res.status(200).json(user || null);
  } catch (err) {
    res.status(401).json({ error: err, message: "Unauthorized user"  });
  }
};
