import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { currentUserRoute, loginRoute, logoutRoute, registerRoute } from "./routes/index";
import passportInitialize from "./passportConfig";
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


const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay }
  })
);

app.use(cookieParser("secretcode"));

app.use(passport.initialize());
app.use(passport.session());
passportInitialize(passport);

app.use(currentUserRoute);
app.use(loginRoute);
app.use(logoutRoute);
app.use(registerRoute);

export { app };