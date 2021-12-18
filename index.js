import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import locationRoutes from "./routes/location.js";
import passportInitialize from "./passportConfig.js";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser("secretcode"));

app.use(passport.initialize());
app.use(passport.session());
passportInitialize(passport);

app.use("/location", locationRoutes);

app.get("/user", (req, res) => {
  res.json({ user: req.user });
});
app.post("/location/login", (req, res, next) => {
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
});

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log(error.message));
