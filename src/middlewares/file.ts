import multer from "multer";


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
  
  export const uploadHandle = (req:any,res:any, next:any) => {
    upload(req, res, (err) => {
        if(err){
          console.log(err);
          res.json({error: req.fileValidation || err.code});
        }
        else next();
    })
  }
  