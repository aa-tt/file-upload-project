import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";

export const saveMetadataToDynamoDB = async (fileName: string, metadata: any) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      FileID: fileName,
      Metadata: metadata,
      UploadedAt: new Date().toISOString(),
    },
  };

  return dynamoDB.put(params).promise();
};