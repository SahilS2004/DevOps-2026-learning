#!/bin/sh
set -e

MAX_ATTEMPTS="${PRISMA_MIGRATION_MAX_ATTEMPTS:-15}"
SLEEP_SECONDS="${PRISMA_MIGRATION_RETRY_DELAY_SECONDS:-5}"

echo "Running Prisma migrations against the configured PostgreSQL database..."
cd server

attempt=1
while true; do
  if npx prisma migrate deploy; then
    break
  fi

  if [ "$attempt" -ge "$MAX_ATTEMPTS" ]; then
    echo "Prisma migrate deploy kept failing. Trying a final fallback with prisma db push..."
    npx prisma db push --accept-data-loss
    break
  fi

  echo "Migration attempt $attempt/$MAX_ATTEMPTS failed. Retrying in ${SLEEP_SECONDS}s..."
  attempt=$((attempt + 1))
  sleep "$SLEEP_SECONDS"
done

echo "Starting server..."
node src/index.js
