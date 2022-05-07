import express from "express";
import { checkAuthenticated } from "../middlewares/auth";
import { uploadHandle } from '../middlewares/file'


import {
  getLocations,
  createLocation,
  getLocation,
  deleteLocation,
  editLocation,
  updateRating,
  createComment,
  getComment,
  postImage,
  getImage
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
router.post("/:id/image", getComment);
router.post("/:id/upload/",uploadHandle, postImage);
router.get("/:key/download", getImage);
export default router;
