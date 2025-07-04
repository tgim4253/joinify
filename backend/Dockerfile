# ---------- base ----------
FROM node:24.0.2-slim AS base
WORKDIR /app

# Install runtime dependencies early for better layer caching
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Install npm dependencies (production + dev) – dev will be pruned later
COPY package*.json ./
RUN npm ci --ignore-scripts

# ---------- dev ----------
FROM base AS dev
ENV NODE_ENV=development
RUN npm install -D nodemon ts-node         # hot-reload helper
COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
CMD ["npm", "run", "dev"]

# ---------- builder ----------
FROM dev AS builder
ENV NODE_ENV=production

COPY tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src

# Build TypeScript → JavaScript and generate Prisma client
RUN npm run build && npx prisma generate

# ---------- production ----------
FROM node:24.0.2-slim AS prod
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
RUN npm prune --omit=dev
COPY --from=builder /app/dist   ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/index.js"]