# ---------- builder ----------
FROM node:20-alpine AS builder
WORKDIR /web
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build               # vite build → dist/

# ---------- runtime ----------
FROM nginx:1.27-alpine         
COPY --from=builder /web/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf  
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
