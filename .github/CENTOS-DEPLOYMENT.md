# GitHub Actions Deployment Setup - CentOS (User: htu12)

## 🚀 Auto-deploy khi có commit mới (CentOS Server - User htu12)

### Bước 1: Thiết lập Secrets trong GitHub Repository

Vào `Settings` → `Secrets and variables` → `Actions` và thêm các secrets sau:

#### Server Connection:
- `SERVER_HOST`: IP address của CentOS server (VD: `123.456.789.0`)
- `SERVER_USER`: `htu12` (fixed username)
- `SERVER_SSH_KEY`: Private SSH key (toàn bộ nội dung file `~/.ssh/id_rsa`)
- `SERVER_PORT`: SSH port (mặc định `22`)

#### Application Secrets:
- `ALLOW_SEARCH_TIME`: `"2025-08-18T05:20:00.0000+07:00"`
- `CAPTCHA_SECRET`: `nUeDm8QhypB06JlttdhgiIWWc9xo4u`
- `BASE_URL_PROD`: `https://api.zorkly.tech`
- `CORS_ORIGIN_PROD`: `https://zorkly.tech`

#### Database Secrets:
- `DB_NAME_PROD`: `appdb`
- `DB_USER_PROD`: `4u0y1820p2jk`
- `DB_PASSWORD_PROD`: `YZtgCdMKup4k7qQOWNecT9ykfU`

### Bước 2: Chuẩn bị CentOS Server (User: htu12)

#### 2.1 Cài đặt Docker & Docker Compose trên CentOS:

```bash
# SSH vào server với user htu12
ssh htu12@your-server-ip

# Update system (CentOS 7/8/9)
sudo yum update -y
# Hoặc cho CentOS 8+/Rocky Linux/AlmaLinux
sudo dnf update -y

# Remove old Docker versions
sudo yum remove -y docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine

# Install required packages
sudo yum install -y yum-utils device-mapper-persistent-data lvm2 curl git

# Add Docker CE repository
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# Install Docker CE
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add user htu12 to docker group
sudo usermod -aG docker htu12
newgrp docker

# Install Docker Compose (standalone) - backup option
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create symlink (optional)
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

# Verify installation
docker --version
docker compose --version
docker-compose --version
```

#### 2.2 Setup Firewall (CentOS):

```bash
# Check firewall status
sudo firewall-cmd --state

# Open necessary ports
sudo firewall-cmd --permanent --add-port=22/tcp    # SSH
sudo firewall-cmd --permanent --add-port=80/tcp    # HTTP
sudo firewall-cmd --permanent --add-port=443/tcp   # HTTPS
sudo firewall-cmd --permanent --add-port=3000/tcp  # Node.js (if needed)
sudo firewall-cmd --permanent --add-port=5432/tcp  # PostgreSQL (if needed)

# Reload firewall
sudo firewall-cmd --reload

# Check opened ports
sudo firewall-cmd --list-ports
```

#### 2.3 Setup SSH Key trên CentOS (User: htu12):

```bash
# SSH vào CentOS server bằng password với user htu12
ssh htu12@your-server-ip

# Tạo SSH key pair trên server
ssh-keygen -t rsa -b 4096 -C "github-actions@zorkly.tech"

# Nhấn Enter 3 lần (để trống passphrase)
# Enter file in which to save the key (/home/htu12/.ssh/id_rsa): [Enter]
# Enter passphrase (empty for no passphrase): [Enter] 
# Enter same passphrase again: [Enter]

# Thêm public key vào authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Set SELinux context (quan trọng cho CentOS)
restorecon -R ~/.ssh

# Xem private key để copy vào GitHub Secrets
cat ~/.ssh/id_rsa
# Copy TOÀN BỘ output (từ -----BEGIN đến -----END)
# Paste vào GitHub Secrets với tên: SERVER_SSH_KEY

# Test SSH (mở terminal mới)
ssh -i ~/.ssh/id_rsa htu12@your-server-ip
```

#### 2.4 Chuẩn bị thư mục trên CentOS (User: htu12):

```bash
# Create project directory for user htu12
sudo mkdir -p /home/htu12/captcha-generator
sudo mkdir -p /home/htu12/backups

# Set ownership to htu12
sudo chown -R htu12:htu12 /home/htu12/captcha-generator
sudo chown -R htu12:htu12 /home/htu12/backups

# Set permissions
chmod 755 /home/htu12/captcha-generator
chmod 755 /home/htu12/backups

# Hoặc tạo trực tiếp bằng user htu12
mkdir -p /home/htu12/captcha-generator
mkdir -p /home/htu12/backups
```

#### 2.5 SELinux Configuration (CentOS specific):

```bash
# Check SELinux status
getenforce

# If SELinux is enabled, configure it for Docker
sudo setsebool -P container_manage_cgroup on

# Allow Docker to bind to ports
sudo setsebool -P nis_enabled on

# For SSH
sudo setsebool -P ssh_sysadm_login on

# Allow user home directory access
sudo setsebool -P use_nfs_home_dirs on
```

### Bước 3: Test Setup

#### 3.1 Test Docker:
```bash
# Test Docker với user htu12
docker run hello-world

# Test Docker Compose
docker compose version
```

#### 3.2 Test SSH:
```bash
# Từ máy local, test SSH key
ssh -i ~/.ssh/id_rsa htu12@your-server-ip

# Nếu thành công, sẽ login không cần password
```

### Bước 4: GitHub Actions Workflow

Workflow đã được cập nhật trong file `.github/workflows/deploy.yml` với:
- ✅ User cố định: `htu12`
- ✅ Path: `/home/htu12/captcha-generator`
- ✅ CentOS specific commands
- ✅ Docker & Docker Compose compatibility
- ✅ Backup functionality

### Bước 5: Deploy Test

```bash
# Từ máy local, push code để trigger workflow
git add .
git commit -m "Setup CentOS deployment for user htu12"
git push origin main

# Kiểm tra GitHub Actions tab để xem workflow chạy
```

### 🔧 Troubleshooting cho CentOS + User htu12

#### Lỗi Docker permission:
```bash
# Add user htu12 to docker group
sudo usermod -aG docker htu12
newgrp docker

# Logout và login lại hoặc restart session
```

#### Lỗi SELinux:
```bash
# Disable SELinux tạm thời (không khuyến nghị cho production)
sudo setenforce 0

# Hoặc configure properly
sudo setsebool -P container_manage_cgroup on
restorecon -R /home/htu12/
```

#### Lỗi Firewall:
```bash
# Check if ports are open
sudo firewall-cmd --list-ports

# Open specific port
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --reload
```

#### Check logs:
```bash
# SSH vào server
ssh htu12@your-server-ip

# Navigate to project
cd /home/htu12/captcha-generator

# Check container logs
docker compose logs -f

# Check container status
docker ps
```

### 📝 Notes cho CentOS + User htu12

1. **User Path**: Tất cả paths đều dùng `/home/htu12/`
2. **Docker Commands**: Hỗ trợ cả `docker compose` và `docker-compose`
3. **SELinux**: Được cấu hình properly cho Docker và SSH
4. **Firewall**: Mở các ports cần thiết
5. **Backup**: Tự động backup trước khi deploy

### 🎯 Checklist Setup

- [ ] SSH vào server với user `htu12`
- [ ] Cài Docker và Docker Compose
- [ ] Setup firewall ports
- [ ] Tạo SSH key và copy vào GitHub Secrets
- [ ] Tạo project directories
- [ ] Configure SELinux
- [ ] Test Docker permissions
- [ ] Test SSH key login
- [ ] Push code để trigger deployment
- [ ] Verify containers running

**Sau khi hoàn thành, mỗi lần push code sẽ tự động deploy lên CentOS server với user htu12!** 🚀
