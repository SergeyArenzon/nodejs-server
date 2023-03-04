import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { createUser } from '../services/pg';


//  REGISTER
export const registerController = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const response = await createUser({email, firstName, lastName, hashedPassword});
      res.status(201).json({message: "Successfully user added."});
    } catch (error) {
      res.status(501).json({error});
    }
  };