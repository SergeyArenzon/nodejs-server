import express from "express";
import bodyParser, { text } from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import locationRoutes from "./routes/location";
import indexRoutes from "./routes/index";
import passportInitialize from "./passportConfig";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import mongoose, { ConnectOptions } from "mongoose";
import { generateUploadURL } from './s3';
import fetch from "node-fetch";



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


app.get('/s3url', async(req, res) => {
  const url = await generateUploadURL();
  const imageName = url.split('?')[0]
  console.log(url);
  
  const x = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: "sss"
  })
  console.log(x);
  
  res.send({x})
  

})

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
