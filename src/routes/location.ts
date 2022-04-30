import express from "express";
import { checkAuthenticated } from "../middlewares/auth";
import multer from "multer";


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



const fileFilter = (req: any, file: any, cb: any) => {
  console.log(file.mimetype.split("/")[0]);
  
  if(file.mimetype.split("/")[0] === "image"){
      cb(null, true); 
  }else {
      req.fileValidation = "file is not correct type"
      return cb(new Error("file is not correct type"), false);
  }
}
const upload = multer({dest: 'uploads/', fileFilter, limits: {fileSize: 1000000, files: 3}}).array('image');

const uploadHandle = (req:any,res:any, next:any) => {
  upload(req, res, (err) => {
      if(err){
        console.log(err);
        res.json({error: req.fileValidation || err.code});
      }
      else next();
  })
}



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
