# ---------- builder ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# install system deps only once
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential && rm -rf /var/lib/apt/lists/*
COPY package*.json .
RUN npm ci

COPY tsconfig*.json .
COPY src ./src
COPY prisma ./prisma

# build TS → JS
RUN npm run build                # tsc && prisma generate

# ---------- production ----------
FROM node:20-bookworm-slim AS production
WORKDIR /app
ENV NODE_ENV=production

# copy only prod deps & dist
COPY --from=builder /app/package*.json .
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 4000

CMD ["node", "dist/main.js"]