# ---------- Builder: compile native deps ----------
FROM node:22-bookworm-slim AS builder

# Toolchain + headers để build node-canvas
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential python3 pkg-config \
    libcairo2-dev libpango1.0-dev libjpeg62-turbo-dev libgif-dev librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /captcha-app

# Cài prod deps deterministically
COPY package*.json ./
# Nếu dùng lockfile, ưu tiên npm ci
RUN npm ci --omit=dev || npm install --omit=dev

# Copy source vào builder để nếu có postinstall cần source
COPY . .

# ---------- Runtime: chỉ giữ libs runtime ----------
FROM node:22-bookworm-slim

# Libs runtime cho canvas (không cần headers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libcairo2 libpango-1.0-0 libpangocairo-1.0-0 \
    libjpeg62-turbo libgif7 librsvg2-2 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /captcha-app

# Copy toàn bộ app đã cài deps từ builder
COPY --from=builder /captcha-app /captcha-app

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "index.js"]
