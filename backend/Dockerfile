# ---------- builder ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# install build deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

COPY package*.json .
RUN npm ci

COPY tsconfig*.json .
COPY src ./src
COPY prisma ./prisma

# build TS → JS & prisma generate (3.0.x)
RUN npm run build && npx prisma generate

# ---------- production ----------
FROM node:20-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*


# 전체 node_modules 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
RUN npm prune --omit=dev  # dev 의존성만 제거 (prisma 등)

# 코드 및 기타 복사
COPY --from=builder /app/dist   ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000
CMD ["node", "dist/index.js"]
