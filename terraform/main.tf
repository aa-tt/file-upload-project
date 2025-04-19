provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "file_upload_bucket" {
  bucket = var.s3_bucket_name
  acl    = "private"
}

resource "aws_s3_bucket_cors_configuration" "file_upload_bucket_cors" {
  bucket = aws_s3_bucket.file_upload_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

resource "aws_dynamodb_table" "file_metadata_table" {
  name           = var.dynamodb_table_name
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "FileID"

  attribute {
    name = "FileID"
    type = "S"
  }
}

resource "aws_iam_role" "lambda_execution_role" {
  name = "lambda_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  inline_policy {
    name = "lambda_policy"
    policy = jsonencode({
      Version = "2012-10-17"
      Statement = [
        {
          Effect   = "Allow"
          Action   = ["s3:PutObject", "s3:GetObject"]
          Resource = ["${aws_s3_bucket.file_upload_bucket.arn}/*"]
        },
        {
          Effect   = "Allow"
          Action   = ["dynamodb:PutItem", "dynamodb:GetItem"]
          Resource = ["${aws_dynamodb_table.file_metadata_table.arn}"]
        },
        {
          Effect   = "Allow"
          Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
          Resource = "*"
        }
      ]
    })
  }
}

resource "aws_lambda_function" "file_upload_lambda" {
  function_name = var.lambda_function_name
  runtime       = "nodejs18.x"
  handler       = "index.handler"
  role          = aws_iam_role.lambda_execution_role.arn

  filename         = "lambda.zip"
  source_code_hash = filebase64sha256("lambda.zip")

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.file_upload_bucket.bucket
      TABLE_NAME  = aws_dynamodb_table.file_metadata_table.name
    }
  }
}

resource "aws_cloudfront_distribution" "react_frontend" {
  origin {
    domain_name = aws_s3_bucket.file_upload_bucket.bucket_regional_domain_name
    origin_id   = "S3Origin"
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Origin"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}