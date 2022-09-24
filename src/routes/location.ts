import express from "express";
import { checkAuthenticated } from "../middlewares/auth";
import { uploadHandle } from '../middlewares/file'


import {
  getLocations,
  postLocation,
  getLocation,
  deleteLocation,
  editLocation,
  putRating,
  createComment,
  getComment,
  postImage,
  getImage,
  getFilter
} from "../controllers/location";

const router = express.Router();

/* ROUTE:  /location  */

router.get("/", getLocations);
router.post("/", checkAuthenticated, postLocation);
router.get("/:id", getLocation);
router.delete("/:id", deleteLocation);
router.put("/:id/edit", editLocation);
router.put("/:id/rating", putRating);
router.post("/:id/comment", createComment);
router.get("/:id/comment", getComment);
router.post("/:id/image", getComment);
router.post("/:id/upload/",uploadHandle, postImage);
router.get("/:key/download", getImage);
router.get("/:type/filter", getFilter);
export default router;
