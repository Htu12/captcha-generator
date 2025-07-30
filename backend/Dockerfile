# Dựa trên Node.js bản chính thức
FROM node:20

# Tạo thư mục app trong container
WORKDIR /usr/src/my-app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở port 3000
EXPOSE 3000

# Chạy app
CMD ["node", "index.js"]
