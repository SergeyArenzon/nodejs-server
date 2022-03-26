import express from "express";
import { postImage, getImage } from "../controllers/s3";
import multer from "multer";
const upload = multer({dest: 'uploads/'})
const router = express.Router();

router.post("/upload",upload.single('image'), postImage);
router.get("/download/:key", getImage);


export default router;
