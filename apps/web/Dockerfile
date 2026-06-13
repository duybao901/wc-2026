FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
ARG VITE_API_URL
ARG VITE_POLL_INTERVAL_MS=5000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_POLL_INTERVAL_MS=$VITE_POLL_INTERVAL_MS
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY package.json package-lock.json ./
COPY apps/web ./apps/web
RUN npm run build -w @wc2026/web

FROM nginx:1.27-alpine AS runtime
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
