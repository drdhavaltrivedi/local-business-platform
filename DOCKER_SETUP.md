# Docker Setup Instructions

## Issue: Permission Denied

Docker requires either:
1. Running with `sudo`
2. Being in the `docker` group

## Quick Fix Options

### Option 1: Use sudo (Quickest)
```bash
cd /home/brilworks/local-business-platform
sudo docker-compose up -d postgres
```

### Option 2: Add to docker group (Permanent)
```bash
# Add yourself to docker group
sudo usermod -aG docker $USER

# Apply changes without logout (temporary)
newgrp docker

# Now you can use docker without sudo
cd /home/brilworks/local-business-platform
docker-compose up -d postgres
```

### Option 3: Use the setup script
```bash
chmod +x start-database.sh
./start-database.sh
```

## After Starting PostgreSQL

1. **Wait a few seconds** for PostgreSQL to initialize
2. **Run migrations:**
   ```bash
   cd backend
   node dist/migrations/run.js
   ```

3. **Verify it worked:**
   ```bash
   # Should see "✅ Migration completed successfully!"
   ```

## Check Status

```bash
# Check if container is running
docker ps | grep postgres

# Check logs if issues
docker-compose logs postgres

# Stop container
docker-compose down

# Start again
docker-compose up -d postgres
```

## Current Status

- ✅ Backend is running on port 3002
- ✅ Health endpoint working: http://localhost:3002/health
- ⏳ Waiting for PostgreSQL to be started
- ⏳ Migrations need to be run

