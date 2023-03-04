import express from "express";
import { registerController } from "../controllers";

const router = express.Router();

router.get("/api/register", registerController);

export {router as registerRoute};