import AWS from 'aws-sdk';
import crypto from 'crypto';
import { promisify } from 'util';
import dotenv from 'dotenv'; 


dotenv.config();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});

export async function generateUploadURL() {
    const randomBytes = promisify(crypto.randomBytes);
    const rawBytes = await randomBytes(16);
    const imageName = rawBytes.toString('hex');

    const params = ({
        Bucket: "viaggio-locations",
        Key: imageName,
        Expires: 60
    })

    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    return uploadURL;
}