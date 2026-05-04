# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client ./
RUN npm run build

# Stage 2: Build Backend & Dependencies
FROM node:20-alpine AS backend-builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/
RUN cd server && npm ci && npx prisma generate

# Stage 3: Minimalist Non-root Runtime Stage (Combines Both)
FROM node:20-alpine AS runner
WORKDIR /app

# Run as a non-root user for security compliance
RUN apk add --no-cache openssl && \
    addgroup -S nodeuser && adduser -S nodeuser -G nodeuser

COPY --from=backend-builder --chown=nodeuser:nodeuser /app/server ./server
COPY --from=frontend-builder --chown=nodeuser:nodeuser /app/client/dist ./client/dist

# Copy backend source code
COPY --chown=nodeuser:nodeuser server/src ./server/src
COPY --chown=nodeuser:nodeuser server/prisma ./server/prisma
COPY --chown=nodeuser:nodeuser server/package*.json ./server/
COPY --chown=nodeuser:nodeuser start.sh ./start.sh

ENV PORT=5005
ENV NODE_ENV=production
ENV HOME=/home/nodeuser

EXPOSE 5005

# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:5005/api/health', (res) => res.statusCode === 200 ? process.exit(0) : process.exit(1))"

USER nodeuser
RUN chmod +x ./start.sh

CMD ["./start.sh"]
