#!/bin/sh
set -e

echo "Running Prisma migrations..."
cd server
npx prisma db push --accept-data-loss

echo "Starting server..."
node src/index.js
