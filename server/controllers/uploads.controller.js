import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../helpers/aws.helpers.js";
import { getRedisClient } from "../db/connetRedis.js";
import dotenv from "dotenv";
const ENV = process.env.NODE_ENV;
dotenv.config({
  path: ENV == "production" ? ".env.production" : ".env.local",
});
export const getPresignedUrl = async (req, res) => {
  const { fileType, fileName } = req.body;
  const userId = req.userId;
  try {
    const newFileName =
      fileName.split(".")[0] +
      "-" +
      Date.now() +
      "." +
      fileName.split(".").at(-1);
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${newFileName}`,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    let redisClient = await getRedisClient();
    const awsPublicUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/uploads/${newFileName}`;
    await redisClient.set(userId, awsPublicUrl);
    return res.json({ signedUrl, publicUrl: awsPublicUrl });
  } catch (err) {
    console.log("SOME AWS ERROR", err);
  }
};
