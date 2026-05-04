# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate

# Stage 2: Minimalist Non-root Runtime Stage
FROM node:20-alpine AS runner
WORKDIR /app

# Run as a non-root user for security compliance
RUN addgroup -S nodeuser && adduser -S nodeuser -G nodeuser
USER nodeuser

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

ENV PORT=5005
ENV NODE_ENV=production

EXPOSE 5005


# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5005/api/health', (res) => res.statusCode === 200 ? process.exit(0) : process.exit(1))"

CMD ["node", "src/index.js"]
