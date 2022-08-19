import bcrypt from "bcrypt";
import User from "../models/User";
import passport from "passport";
import { NextFunction, Request, Response } from "express";
import {Client, Pool} from "pg";


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



export const db = async(req: Request, res: Response) => {
  try {

  const pool = new Pool({
    // user: 'zznvdkishhyiuf',
    // host: 'ec2-23-23-151-191.compute-1.amazonaws.com',
    // database: 'd575fg640odkjn',
    // password: 'b580ef53d610fcc98e3e61f4785107d10cbc1eef317a054529c7fe9fbdb065dd',
    // port: 5432,
    connectionString: "postgres://zznvdkishhyiuf:b580ef53d610fcc98e3e61f4785107d10cbc1eef317a054529c7fe9fbdb065dd@ec2-23-23-151-191.compute-1.amazonaws.com:5432/d575fg640odkjn",
    ssl: {
      rejectUnauthorized: false
    }
  });
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    res.json( results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
};


export const getLogout = (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.logout();
    res.json({ message: "successfully logout", user });
  } catch (err) {
    res.json({ err: err });
  }
};

export const postRegister = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const response = await user.save();
    res.status(201).json({
      message: "Successfully user added.",
      response,
    });
  } catch (error) {
    res.status(501).json({
      message: "Failed adding user",
      error,
    });
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
