output "application_url" {
  value       = "http://${aws_lb.main.dns_name}"
  description = "The public URL to access the ShopSmart application"
}
