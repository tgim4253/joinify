# ---------- base ----------
FROM node:24.0.2-slim AS base
WORKDIR /web

COPY package.json package-lock.json ./
RUN npm ci  # clean install

# ---------- dev ----------
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

# ---------- builder ----------
FROM base AS builder
COPY . .
RUN npm run build

# ---------- runtime ----------
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
