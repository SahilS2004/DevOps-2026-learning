# ECR Repository
resource "aws_ecr_repository" "app_repo" {
  name                 = "shopsmart-app"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "shopsmart-cluster"
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "shopsmart-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/shopsmart-app"
  retention_in_days = 7
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "shopsmart-app-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "shopsmart-container"
      image     = "${aws_ecr_repository.app_repo.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 5005
          hostPort      = 5005
          protocol      = "tcp"
        }
      ]
      environment = [
        { name = "PORT", value = "5005" },
        { name = "NODE_ENV", value = "production" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_logs.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      mountPoints = [
        {
          sourceVolume  = "sqlite-data-volume"
          containerPath = "/app/server/prisma"
          readOnly      = false
        }
      ]
    }
  ])

  volume {
    name = "sqlite-data-volume"
    efs_volume_configuration {
      file_system_id          = aws_efs_file_system.sqlite_data.id
      transit_encryption      = "ENABLED"
      authorization_config {
        access_point_id = aws_efs_access_point.sqlite_ap.id
        iam             = "ENABLED"
      }
    }
  }
}

# ECS Service
resource "aws_ecs_service" "app_service" {
  name            = "shopsmart-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_1.id, aws_subnet.public_2.id]
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  # Ensure the service can be recreated if task def changes
  force_new_deployment = true
}
