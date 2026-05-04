output "application_url" {
  value       = "http://${aws_lb.main.dns_name}"
  description = "The public URL to access the ShopSmart application"
}

output "ecs_cluster_name" {
  value       = aws_ecs_cluster.main.name
  description = "ECS cluster name"
}

output "ecs_service_name" {
  value       = aws_ecs_service.app_service.name
  description = "ECS service name"
}

output "ecs_task_definition_family" {
  value       = aws_ecs_task_definition.app.family
  description = "ECS task definition family name"
}

output "ecr_repository_url" {
  value       = aws_ecr_repository.app_repo.repository_url
  description = "ECR repository URL used by the ECS task definition"
}
