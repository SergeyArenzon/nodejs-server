import AWS from 'aws-sdk';
import crypto from 'crypto';
import { promisify } from 'util';
import dotenv from 'dotenv'; 
import fs from 'fs';



dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});



export async function uploadFiles(files: any){



    const params = files.map((file: any) => {
        const fileStream = fs.createReadStream(file.path);
        return {
            
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: file.filename,
            Body: fileStream
                
        }
    }) 

   return await Promise.all(params.map((param: any )=> s3.upload(param).promise() ))



    // const params = ({
    //     Bucket: process.env.AWS_BUCKET_NAME!,
    //     Key: file.filename,
    //     Body: fileStream
    // })
    // console.log( params);
    
    // return s3.upload(params).promise();
}


export async function getFile(fileName: string) {
    const params = {
        Key: fileName,
        Bucket: process.env.AWS_BUCKET_NAME!
    }
    return s3.getObject(params).createReadStream();
}