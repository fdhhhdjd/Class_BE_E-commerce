#!/bin/bash

# Đường dẫn đến file lưu trữ thông tin tài khoản
FOLDER_PASSWORD="/etc/nginx/.htpasswd"

# Tạo file nếu chưa tồn tại
touch "$FOLDER_PASSWORD"

# Thông tin tài khoản
username="taidev"
password="taideptrai"

# Mã hóa mật khẩu
encrypted_password=$(openssl passwd -apr1 "$password")

# Ghi thông tin tài khoản vào file
echo "$username:$encrypted_password" >> "$FOLDER_PASSWORD"

echo "Created account success 😍"

# Tải lại Nginx để áp dụng thay đổi
nginx -s reload
