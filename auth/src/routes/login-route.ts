import express from "express";
import { loginController } from "../controllers";

const router = express.Router();

router.get("/api/login", loginController);

export {router as loginRoute};