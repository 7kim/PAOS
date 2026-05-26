---
name: vps-kit
description: AWS EC2 VPS connection kit — SSH access, server info, quick commands, and management for the dev VPS (13.233.237.221, Ubuntu 26.04, ap-south-1). Trigger with "ssh", "vps", "server", "ec2", "connect to vps", or "deploy to server".
---

# VPS Kit

AWS EC2 VPS connection and management skill. Provides SSH access credentials, server topology, and quick-command templates for the dev VPS running Ubuntu 26.04 LTS in ap-south-1.

## Connection Details

| Field | Value |
|-------|-------|
| **Public IP** | `13.233.237.221` |
| **Public DNS** | `ec2-13-233-237-221.ap-south-1.compute.amazonaws.com` |
| **Private IP** | `172.31.43.91` |
| **Region** | `ap-south-1` (Mumbai) |
| **OS** | Ubuntu 26.04 LTS (Resolute Raccoon) |
| **Username** | `ubuntu` |
| **SSH Key** | `config/secrets/dev.pem` |
| **Instance ID** | `i-06798de0103d57fe9` |
| **AWS Account** | via `AKIAV4IE3PCUYOXKEON5` (in `config/secrets/.env`) |

## Quick SSH

```bash
ssh -i config/secrets/dev.pem ubuntu@13.233.237.221
```

## Server Topology

- **Hostname**: `ip-172-31-43-91` (internal EC2 hostname)
- **Default user**: `ubuntu` (sudo via `sudo` — no password required)
- **Key type**: ED25519 (`config/secrets/dev.pem`)

## Common Commands

All commands assume SSH connection is established first.

### System Info
```bash
# OS version
cat /etc/os-release

# Kernel
uname -a

# Uptime
uptime

# Disk usage
df -h

# Memory
free -h

# CPU info
lscpu | grep "Model name"
```

### Process & Service Management
```bash
# List running services
systemctl list-units --type=service --state=running

# List all listening ports
ss -tulpn

# Top processes by resource
top -b -n 1 | head -20
```

### Tailscale (if installed)
```bash
sudo tailscale status
sudo tailscale up
```

### Docker (if installed)
```bash
docker ps
docker images
docker-compose ps
```

### File Transfer
```bash
# Upload a file
scp -i config/secrets/dev.pem /local/path ubuntu@13.233.237.221:/remote/path

# Download a file
scp -i config/secrets/dev.pem ubuntu@13.233.237.221:/remote/path /local/path

# Rsync a directory
rsync -avz -e "ssh -i config/secrets/dev.pem" /local/dir/ ubuntu@13.233.237.221:/remote/dir/
```

### Git Operations (remote)
```bash
# Clone AI_Workflow on the server
git clone https://github.com/7kim/AI_Workflow.git

# Pull latest
git pull origin main
```

## AWS EC2 Operations (via CLI)

These run **locally** using the AWS CLI credentials in `config/secrets/.env`:

```bash
# Source credentials
source config/secrets/.env

# List instances
aws ec2 describe-instances --region ap-south-1 --query "Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress,Tags[?Key=='Name'].Value|[0]]" --output table

# Get console output (if instance becomes unresponsive)
aws ec2 get-console-output --instance-id i-06798de0103d57fe9 --region ap-south-1 --output text

# Reboot instance
aws ec2 reboot-instances --instance-ids i-06798de0103d57fe9 --region ap-south-1

# Start/Stop instance
aws ec2 stop-instances --instance-ids i-06798de0103d57fe9 --region ap-south-1
aws ec2 start-instances --instance-ids i-06798de0103d57fe9 --region ap-south-1
```

## Setup Script

A provisioning script exists at `/home/dev/Downloads/setup-vps.sh`. It installs:
- Node.js 20 LTS
- Tailscale
- Git, curl, wget, unzip, snapd, flatpak, build-essential
- Creates `/home/dev/ecommerce-platform/` directory structure
- Clones `awesome-design-md` and `AI_Workflow`

To run it on the server:
```bash
# Copy it up
scp -i config/secrets/dev.pem /home/dev/Downloads/setup-vps.sh ubuntu@13.233.237.221:~/
# Execute
ssh -i config/secrets/dev.pem ubuntu@13.233.237.221 "bash ~/setup-vps.sh"
```

## SSH Config (for quick access)

Add to `~/.ssh/config` for shorthand `ssh dev-vps`:
```
Host dev-vps
    HostName 13.233.237.221
    User ubuntu
    IdentityFile config/secrets/dev.pem
    StrictHostKeyChecking accept-new
```
