#!/bin/bash

echo "🚀 Setting up Local Business Platform Database"
echo ""

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "✅ Docker found. Using Docker Compose..."
    
    # Start PostgreSQL container
    docker-compose up -d postgres
    
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 5
    
    # Run migrations
    echo "📦 Running database migrations..."
    cd backend
    npm run build
    node dist/migrations/run.js
    
    echo ""
    echo "✅ Database setup complete!"
    echo "PostgreSQL is running in Docker on port 5432"
    
elif command -v psql &> /dev/null; then
    echo "✅ PostgreSQL client found. Creating database..."
    
    # Try to create database
    psql -U postgres -c "CREATE DATABASE local_business_platform;" 2>/dev/null || \
    psql -h localhost -U user -c "CREATE DATABASE local_business_platform;" 2>/dev/null || \
    echo "⚠️  Could not create database automatically. Please create it manually:"
    echo "   createdb local_business_platform"
    
    # Run migrations
    echo "📦 Running database migrations..."
    cd backend
    npm run build
    node dist/migrations/run.js
    
    echo ""
    echo "✅ Database setup complete!"
    
else
    echo "❌ Neither Docker nor PostgreSQL client found."
    echo ""
    echo "Please install one of the following:"
    echo "  1. Docker: sudo apt install docker.io docker-compose"
    echo "  2. PostgreSQL: sudo apt install postgresql postgresql-contrib"
    echo ""
    echo "Or use the Supabase setup (see docs/SUPABASE_SETUP.md)"
    exit 1
fi

