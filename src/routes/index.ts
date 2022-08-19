import express from "express";
import { getLogout, postRegister, postLogin, getUser, db } from "../controllers/index";

const router = express.Router();

/* ROUTE:/  */

router.get("/logout", getLogout);
router.post("/register", postRegister);
router.post("/login", postLogin);
router.get("/user", getUser);
router.get("/db", db);

export default router;
