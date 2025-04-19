output "s3_bucket_name" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.file_upload_bucket.bucket
}

output "dynamodb_table_name" {
  description = "The name of the DynamoDB table"
  value       = aws_dynamodb_table.file_metadata_table.name
}

output "lambda_function_name" {
  description = "The name of the Lambda function"
  value       = aws_lambda_function.file_upload_lambda.function_name
}

output "cloudfront_distribution_domain" {
  description = "The domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.react_frontend.domain_name
}