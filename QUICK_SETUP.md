# Quick Database Setup

Since PostgreSQL isn't installed locally, here are your options:

## Option 1: Use Docker (Recommended - No Installation Needed)

```bash
# Install Docker (if not installed)
sudo apt update
sudo apt install docker.io docker-compose

# Start PostgreSQL
cd /home/brilworks/local-business-platform
docker-compose up -d postgres

# Wait a few seconds, then run migrations
cd backend
npm run build
node dist/migrations/run.js
```

## Option 2: Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database (as postgres user)
sudo -u postgres createdb local_business_platform

# Or create with your user
createdb local_business_platform

# Run migrations
cd backend
npm run build
node dist/migrations/run.js
```

## Option 3: Use Supabase (Cloud Database - No Local Setup)

The project was previously configured for Supabase. You can:
1. Create a new Supabase project
2. Get the connection string
3. Update `backend/.env` with `DATABASE_URL`
4. The code will work with Supabase

## Option 4: Use the Setup Script

```bash
chmod +x setup-database.sh
./setup-database.sh
```

This script will automatically detect Docker or PostgreSQL and set up the database.

## Verify Setup

After setup, test the connection:

```bash
cd backend
npm run dev
```

You should see "Database connected" in the logs.

