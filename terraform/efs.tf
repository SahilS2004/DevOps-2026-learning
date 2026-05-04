# EFS File System
resource "aws_efs_file_system" "sqlite_data" {
  creation_token   = "shopsmart-sqlite-efs"
  performance_mode = "generalPurpose"
  throughput_mode  = "bursting"
  encrypted        = true

  tags = {
    Name = "shopsmart-sqlite-data"
  }
}

# EFS Mount Targets
resource "aws_efs_mount_target" "efs_mt_1" {
  file_system_id  = aws_efs_file_system.sqlite_data.id
  subnet_id       = aws_subnet.public_1.id
  security_groups = [aws_security_group.efs.id]
}

resource "aws_efs_mount_target" "efs_mt_2" {
  file_system_id  = aws_efs_file_system.sqlite_data.id
  subnet_id       = aws_subnet.public_2.id
  security_groups = [aws_security_group.efs.id]
}

# EFS Access Point (Optional but good practice for ECS)
resource "aws_efs_access_point" "sqlite_ap" {
  file_system_id = aws_efs_file_system.sqlite_data.id

  posix_user {
    gid = 1000 # Node user
    uid = 1000 # Node user
  }

  root_directory {
    path = "/sqlite"
    creation_info {
      owner_gid   = 1000
      owner_uid   = 1000
      permissions = "0777"
    }
  }
}
