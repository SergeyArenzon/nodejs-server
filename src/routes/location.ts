import express from "express";
import { checkAuthenticated } from "../middlewares/auth";

import {
  getLocations,
  createLocation,
  getLocation,
  deleteLocation,
  editLocation,
  updateRating,
  createComment,
  getComment,
} from "../controllers/location";

const router = express.Router();

/* ROUTE:  /location  */

router.get("/", getLocations);
router.post("/", checkAuthenticated, createLocation);
router.get("/:id", getLocation);
router.delete("/:id", deleteLocation);
router.put("/:id/edit", editLocation);
router.put("/:id/rating", updateRating);
router.post("/:id/comment", createComment);
router.get("/:id/comment", getComment);

export default router;
