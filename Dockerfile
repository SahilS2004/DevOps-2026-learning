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
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/
RUN cd server && npm ci && npx prisma generate

# Stage 3: Minimalist Non-root Runtime Stage (Combines Both)
FROM node:20-alpine AS runner
WORKDIR /app

# Run as a non-root user for security compliance
RUN addgroup -S nodeuser && adduser -S nodeuser -G nodeuser
USER nodeuser

COPY --from=backend-builder /app/server ./server
COPY --from=frontend-builder /app/client/dist ./client/dist

# Copy backend source code
COPY server/src ./server/src

ENV PORT=5005
ENV NODE_ENV=production

EXPOSE 5005

# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5005/api/health', (res) => res.statusCode === 200 ? process.exit(0) : process.exit(1))"
# Copy startup script
COPY --chown=nodeuser:nodeuser start.sh ./start.sh
RUN chmod +x ./start.sh

CMD ["./start.sh"]
