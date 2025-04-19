variable "aws_region" {
  description = "The AWS region to deploy resources in"
  default     = "us-east-1"
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket for file uploads"
  default     = "file-upload-project-bucket"
}

variable "dynamodb_table_name" {
  description = "The name of the DynamoDB table for file metadata"
  default     = "FileMetadata"
}

variable "lambda_function_name" {
  description = "The name of the Lambda function for file uploads"
  default     = "file-upload-backend"
}