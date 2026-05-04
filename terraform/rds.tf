# Security Group for RDS
resource "aws_security_group" "rds_sg" {
  name        = "shopsmart-rds-sg"
  description = "Allow inbound PostgreSQL access from ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol        = "tcp"
    from_port       = 5432
    to_port         = 5432
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "shopsmart-db-subnet-group"
  subnet_ids = [aws_subnet.public_1.id, aws_subnet.public_2.id]

  tags = {
    Name = "shopsmart DB subnet group"
  }
}

# RDS PostgreSQL Instance
resource "aws_db_instance" "postgres" {
  identifier             = "shopsmart-db"
  engine                 = "postgres"
  engine_version         = "16" # or 15 depending on academy availability, 16 is widely supported
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_type           = "gp2"
  db_name                = "shopsmart"
  username               = "postgres"
  password               = "ShopSmartPass2026!" # Hardcoded for demo/academy purposes
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  publicly_accessible    = false
  skip_final_snapshot    = true # Required for easy deletion in Academy

  tags = {
    Name = "shopsmart-rds"
  }
}
