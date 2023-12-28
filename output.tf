output "public_ip" {
  value = aws_instance.email_scheduler_ec2.public_ip
  description = "Public IP address of the Node.js application instance"
}

output "instance_id" {
  value = aws_instance.email_scheduler_ec2.id
  description = "ID of the EC2 instance"
}

output "security_group_id" {
  value = aws_security_group.email_scheduler_sg.id
  description = "ID of the security group allowing web traffic"
}
