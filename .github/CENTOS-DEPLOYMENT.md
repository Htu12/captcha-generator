# GitHub Actions Deployment Setup - CentOS

## 🚀 Auto-deploy khi có commit mới (CentOS Server - User htu12)

### Bước 1: Thiết lập trên CentOS
```bash
#SSH USER ROOT
ssh root@ip-server
sudo yum update -y

#INSTALL DOCKER&DOCKER COMPOSE
sudo dnf remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine

sudo dnf -y install dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

sudo dnf install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable --now docker             


#CREATE NEW USER PERMISSION SUDO
sudo adduser htu12
sudo passwd htu12

sudo usermod -aG wheel htu12
su - htu12

getent group docker || sudo groupadd docker
sudo usermod -aG docker htu12
sudo systemctl restart docker
newgrp docker

#Set up firewall status
# Check firewall status
sudo firewall-cmd --state

# Open necessary ports
sudo firewall-cmd --permanent --add-port=80/tcp    # HTTP
sudo firewall-cmd --permanent --add-port=443/tcp   # HTTPS

# Reload firewall
sudo firewall-cmd --reload

# Check opened ports
sudo firewall-cmd --list-ports

```

### Bước 2: Tạo SSH key pair
```bash
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

cat ~/.ssh/id_rsa
```

### Bước 3: Thiết lập Secrets trong GitHub Repository

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


### Bước 4: SELinux Configuration (CentOS specific):

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

