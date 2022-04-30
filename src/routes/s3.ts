import express from "express";
import { postImage, getImage } from "../controllers/s3";
import multer from "multer";
import { nextTick } from "process";
const router = express.Router();

const fileFilter = (req: any, file: any, cb: any) => {
    if(file.mimetype.split("/")[0] === "image"){
        cb(null, true); 
    }else {
        req.fileValidation = "file is not correct type"
        return cb(new Error("file is not correct type"), false);
    }
}
const upload = multer({dest: 'uploads/', fileFilter, limits: {fileSize: 1000000, files: 3}}).array('images');

const uploadHandle = (req:any,res:any, next:any) => {
    upload(req, res, (err) => {
        if(err) res.json({error: req.fileValidation || err.code});
        else next();
    })
}

router.post("/upload",uploadHandle, postImage);
router.get("/download/:key", getImage);


export default router;
