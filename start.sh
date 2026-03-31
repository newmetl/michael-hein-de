#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

echo "Ensuring default pages exist..."
node prisma/ensure-pages.mjs

echo "Starting server..."
exec node server.js
