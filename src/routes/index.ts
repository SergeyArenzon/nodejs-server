import express from "express";
import { getLogout, postRegister, postLogin, getUser } from "../controllers/index";

const router = express.Router();

/* ROUTE:/  */

router.get("/logout", getLogout);
router.post("/register", postRegister);
router.post("/login", postLogin);
router.get("/user", getUser);

export default router;
