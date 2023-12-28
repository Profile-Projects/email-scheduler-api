resource "aws_instance" "email_scheduler_ec2" {
    ami = "ami-0a5ac53f63249fba0"
    instance_type = "t2.micro"

    security_groups = [aws_security_group.email_scheduler_sg.name]

    user_data = <<-EOF
        #!/bin/bash

        sudo yum update -y
        sudo amazon-linux-extras install docker -y
        sudo yum install make
        sudo service docker start
        sudo usermod -aG docker ec2-user
        docker pull santhoshgugan/email-scheduler-api:latest  # Replace with your image name
        docker run -d -p 80:80 santhoshgugan/email-scheduler-api:latest 
    EOF
}
