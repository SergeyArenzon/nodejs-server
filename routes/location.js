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
  postLogin
  
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
// router.post("/login", postLogin);

export default router;
