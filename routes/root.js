import express from "express";

import { getLogout } from "../controllers/location.js";

const router = express.Router();

/* 
ROUTE:  /location  
*/

router.get("/logout", getLogout);

export default router;
