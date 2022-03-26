
import util from 'util';
import fs from 'fs';
import { Request, Response } from "express";
import { uploadFile, getFile } from '../services/s3';
const unlinkFile = util.promisify(fs.unlink);


export const postImage = async (req: Request, res: Response) => {
    if(!req.file){
        res.status(400).json({error: "File not found"});
        return;
    }
    try {
        const file = req.file;    
        const result = await uploadFile(file);
        await unlinkFile(file.path);
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