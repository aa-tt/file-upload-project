import { APIGatewayProxyHandler } from "aws-lambda";
import { uploadFileToS3 } from "./s3Service";
import { saveMetadataToDynamoDB } from "./dynamoService";

export const uploadFile: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { fileName, fileContent, metadata } = body;

    if (!fileName || !fileContent || !metadata) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    // Upload file to S3
    const s3Response = await uploadFileToS3(fileName, fileContent);

    // Save metadata to DynamoDB
    const dynamoResponse = await saveMetadataToDynamoDB(fileName, metadata);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully",
        s3Response,
        dynamoResponse,
      }),
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", error }),
    };
  }
};