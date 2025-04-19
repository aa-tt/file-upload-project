import AWS from "aws-sdk";

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.BUCKET_NAME || "";

export const uploadFileToS3 = async (fileName: string, fileContent: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: Buffer.from(fileContent, "base64"),
  };

  return s3.upload(params).promise();
};