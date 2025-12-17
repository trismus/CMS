#!/bin/sh
set -e

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migrations..."
npm run migrate || echo "Migrations failed or already applied"

echo "Seeding database with test users..."
npm run seed || echo "Seeding failed or already done"

echo "Starting server..."
exec npm run dev
