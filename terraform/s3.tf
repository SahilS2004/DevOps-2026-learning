# 1. Bucket Resource with unique name
resource "aws_s3_bucket" "library_bucket" {
  bucket        = "dev-lib-ops-1"
  force_destroy = true
}

# 2. Versioning Configuration
resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.library_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# 3. Server-Side Encryption Configuration
resource "aws_s3_bucket_server_side_encryption_configuration" "encryption" {
  bucket = aws_s3_bucket.library_bucket.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 4. Public Access Block Configuration
resource "aws_s3_bucket_public_access_block" "public_block" {
  bucket = aws_s3_bucket.library_bucket.id

  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read_books" {
  bucket = aws_s3_bucket.library_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadUploadedBooks"
        Effect    = "Allow"
        Principal = "*"
        Action    = ["s3:GetObject"]
        Resource  = "${aws_s3_bucket.library_bucket.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.public_block]
}

# Output definitions
output "s3_bucket_name" {
  value       = aws_s3_bucket.library_bucket.id
  description = "The name of the newly created S3 bucket"
}
