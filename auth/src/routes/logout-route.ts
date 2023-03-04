import express from "express";
import { logoutController } from "../controllers";

const router = express.Router();

router.get("/api/logout", logoutController);

export {router as logoutRoute};