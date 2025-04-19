import { APIGatewayProxyHandler } from "aws-lambda";
import { uploadFileToS3 } from "./s3Service";
import { saveMetadataToDynamoDB } from "./dynamoService";

export const uploadFile: APIGatewayProxyHandler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    // Handle preflight request
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: "",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { fileName, fileContent, metadata } = body;

    if (!fileName || !fileContent || !metadata) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS, POST",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    // Upload file to S3
    const s3Response = await uploadFileToS3(fileName, fileContent);

    // Save metadata to DynamoDB
    const dynamoResponse = await saveMetadataToDynamoDB(fileName, metadata);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
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
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      body: JSON.stringify({ message: "Internal server error", error }),
    };
  }
};