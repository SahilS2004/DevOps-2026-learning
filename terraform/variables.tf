variable "aws_region" {
  default     = "us-east-1"
  description = "AWS region for infrastructure provisioning"
}

variable "app_port" {
  type        = number
  default     = 5005
  description = "Port exposed by the ShopSmart application container"
}

variable "db_name" {
  type        = string
  default     = "shopsmart"
  description = "Database name for the RDS PostgreSQL instance"
}

variable "db_username" {
  type        = string
  default     = "postgres"
  description = "Master username for the RDS PostgreSQL instance"
}

variable "db_password" {
  type        = string
  default     = "ShopSmartPass2026"
  sensitive   = true
  description = "Master password for the RDS PostgreSQL instance"
}
