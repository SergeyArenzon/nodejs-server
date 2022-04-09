
import util from 'util';
import fs from 'fs';
import { Request, Response } from "express";
import { uploadFiles, getFile } from '../services/s3';
const unlinkFile = util.promisify(fs.unlink);


export const postImage = async (req: Request, res: Response) => {
    if(!req.files){
        res.status(400).json({error: "Files not found"});
        return;
    }
    
    try {
        const files = req.files;    
        const result = await uploadFiles(files);
        // await unlinkFile(file.path);
        res.status(200).json({message: 'File sucessfuly uploaded', s3: result});
    } catch (error) {
        res.status(200).json({error: error, message: "File uploading failed"});
    }
}

export const getImage = async (req: Request, res: Response) => {
    const key = req.params.key;
    const readStream  = getFile(key);
    (await readStream).pipe(res)
}