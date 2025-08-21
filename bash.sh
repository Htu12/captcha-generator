# 1. Tạo group deployers nếu chưa có
sudo groupadd -f deployers

# 2. Thêm user zorkly vào group deployers
sudo usermod -aG deployers zorkly

# 3. Tạo file sudoers riêng cho group (an toàn hơn chỉnh trực tiếp /etc/sudoers)
echo "%deployers ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/systemctl" | sudo tee /etc/sudoers.d/deployers

# 4. Đặt permission đúng cho file sudoers
sudo chmod 440 /etc/sudoers.d/deployers
