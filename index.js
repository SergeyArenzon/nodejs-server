import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import locationRoutes from './routes/location.js';


const app = express();

app.use("/location", locationRoutes)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;


mongoose.connect(MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch((error) => console.log(error.message));


// mongoose.set("useFindAndModify", false);

