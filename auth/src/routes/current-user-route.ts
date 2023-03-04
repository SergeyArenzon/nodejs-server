import express from "express";
import { currentUserController } from "../controllers";

const router = express.Router();

router.get("/api/currentuser", currentUserController);

export {router as currentUserRoute};