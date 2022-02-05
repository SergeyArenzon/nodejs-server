import bcrypt from "bcrypt";
import User from "../models/User.js";
import passport from "passport";

export const getLogout = (req, res) => {
  try {
    const user = req.user;
    req.logout();
    res.json({ message: "successfully logout", user });
  } catch (err) {
    res.json({ err: err });
  }
};

export const postRegister = async (req, res) => {
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

export const postLogin = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.status(401).json({ message: "No user exist" });
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res
          .status(200)
          .json({ message: "Successfully Authenticated", user: user });
      });
    }
  })(req, res, next);
};

export const getUser = async (req, res) => {
  const user = req.user;
  try {
    user.password = undefined;
    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ error: err, message: "Unauthorized user"  });
  }
};
