import express from "express";
import passport from 'passport';

import {
  getLocations,
  createLocation,
  getLocation,
  deleteLocation,
  editLocation,
  updateRating,
  createComment,
  getComment,
  postRegister,
  postLogin,
  getLogout,
  getUser,
  getTest
  
} from "../controllers/location.js";

const router = express.Router();

/* 
ROUTE:  /location  
*/

router.get("/", getLocations);
router.post("/", createLocation);
router.get("/:id", getLocation);
router.delete("/:id", deleteLocation);
router.put("/:id/edit", editLocation);
router.put("/:id/rating", updateRating);
router.post("/:id/comment", createComment);
router.get("/:id/comment", getComment);
router.post("/register", postRegister);
router.post("/login", postLogin);
router.get("/logout", getLogout);
router.get("/user", getUser);
router.get("/test", getTest);

export default router;
