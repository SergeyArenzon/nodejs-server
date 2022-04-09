import express from "express";
import { postImage, getImage } from "../controllers/s3";
import multer from "multer";
const router = express.Router();
const app = express();

const fileFilter = (req: any, file: any, cb: any) => {
    if(file.mimetype.split("/")[0] === "image"){
        cb(null, true); 
    }else {
        cb(new Error("file is not correct type"), false);
    }
}
const upload = multer({dest: 'uploads/', fileFilter, limits: {fileSize: 1000000, files: 3}});

// app.use((error: any, req: any, res: any, next: any) => {
//     console.log("------------------");
    
//     if(error instanceof multer.MulterError){
//         if(error.code === "LIMIT_FILE_COUNT") return res.json({message: "Too many files"})
//     }
//   })

router.post("/upload",upload.array('image'), postImage);
router.get("/download/:key", getImage);


export default router;
