import { NextFunction, Request, Response } from "express";


export const logoutController = (req: Request, res: Response) => {
    try {
      const user = req.user;
      req.logout();
      res.json({ message: "successfully logout", user });
    } catch (err) {
      res.json({ err: err });
    }
  };
  