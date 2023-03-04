import { NextFunction, Request, Response } from "express";

export const currentUserController = async (req: Request, res: Response) => {
    const { user }  = req;
    try {
      res.status(200).json(user || null);
    } catch (err) {
      res.status(401).json({ error: err, message: "Unauthorized user"  });
    }
  };
  