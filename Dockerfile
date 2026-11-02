# Haeru — SPA + Pulse API + Telegram Voice AI (Coolify)
FROM node:22-alpine AS build
WORKDIR /app
# Coolify may inject NODE_ENV=production into the build; keep tooling available.
ENV NODE_ENV=development

RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json* ./
COPY backend/prisma ./backend/prisma
RUN npm ci --include=dev || npm install
RUN npx prisma generate --schema backend/prisma/schema.prisma

COPY . .
# Install used NODE_ENV=development so tsc/vite exist; force production mode for the SPA bundle
# (otherwise import.meta.env.DEV stays true and PersonaSwitcher ships to parents).
RUN NODE_ENV=production npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HAERU_DATA_DIR=/data

RUN apk add --no-cache openssl libc6-compat

COPY package.json package-lock.json* ./
COPY backend/prisma ./backend/prisma
RUN npm ci --omit=dev || npm install --omit=dev
RUN npx prisma generate --schema backend/prisma/schema.prisma

COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server
COPY server.mjs ./server.mjs

RUN mkdir -p /data

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.mjs"]
