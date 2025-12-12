#!/bin/bash

echo "🐳 Starting PostgreSQL with Docker..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running or you don't have permission."
    echo ""
    echo "Try one of these:"
    echo "  1. Run with sudo: sudo docker-compose up -d postgres"
    echo "  2. Add yourself to docker group: sudo usermod -aG docker $USER"
    echo "     Then log out and back in, or run: newgrp docker"
    exit 1
fi

# Start PostgreSQL
cd "$(dirname "$0")"
docker-compose up -d postgres

echo ""
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Check if container is running
if docker ps | grep -q local_business_platform_db; then
    echo "✅ PostgreSQL container is running!"
    echo ""
    echo "Now run migrations:"
    echo "  cd backend"
    echo "  node dist/migrations/run.js"
else
    echo "❌ Container failed to start. Check logs:"
    echo "  docker-compose logs postgres"
fi

