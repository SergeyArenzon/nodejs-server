
import util from 'util';
import fs from 'fs';
import { Request, Response } from "express";
import { uploadFile, getFile } from '../s3';
const unlinkFile = util.promisify(fs.unlink);




export const postImage = async (req: Request, res: Response) => {

    console.log(req.file);
    const file = req.file!;
    const result = await uploadFile(file);
    await unlinkFile(file.path);
    res.send(result)
}


export const getImage = async (req: Request, res: Response) => {
    const key = req.params.key;
    const readStream  = getFile(key);
    (await readStream).pipe(res)
}