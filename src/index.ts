import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import locationRoutes from "./routes/location";
import indexRoutes from "./routes/index";
import passportInitialize from "./passportConfig";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import mongoose, { ConnectOptions } from "mongoose";




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
    secret: process.env.SESSION_SECRET!,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser("secretcode"));

app.use(passport.initialize());
app.use(passport.session());
passportInitialize(passport);

app.use("/", indexRoutes);
app.use("/location", locationRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URL: string | undefined  = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL!, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((error) => console.log(error.message));
