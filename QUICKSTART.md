# Quick Start Guide

Get the Local Business Empowerment Platform running in 5 minutes!

## Prerequisites Check

```bash
node --version  # Should be 18+
psql --version  # Should be 14+
```

## Step 1: Database Setup

```bash
# Create database
createdb local_business_platform

# Or using psql
psql -U postgres -c "CREATE DATABASE local_business_platform;"
```

## Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/local_business_platform
# JWT_SECRET=your-secret-key-here
# STRIPE_SECRET_KEY=sk_test_...

# Run migrations
npm run build
node dist/migrations/run.js

# Start server
npm run dev
```

Backend should be running on `http://localhost:3001`

## Step 3: Shared Package

```bash
cd ../shared
npm install
npm run build
```

## Step 4: Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend should be running on `http://localhost:3000`

## Step 5: Test It Out!

1. Open `http://localhost:3000` in your browser
2. Click "Register" to create an account
3. Choose a role (Customer, Merchant, etc.)
4. Log in and explore the dashboard!

## Creating Your First Admin User

To create an admin user, you can either:

1. **Via Database** (Quick):
```sql
-- First, create a regular user through the UI
-- Then update their role in the database:
UPDATE users SET roles = '["user", "admin"]' WHERE email = 'admin@example.com';
UPDATE users SET status = 'active' WHERE email = 'admin@example.com';
```

2. **Via API** (After registration):
```bash
# Register normally, then use admin endpoint to activate
curl -X POST http://localhost:3001/api/admin/users/{userId}/activate \
  -H "Authorization: Bearer {admin_token}"
```

## Common Issues

### Database Connection Error
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials in `.env`
- Ensure database exists

### Port Already in Use
- Change `PORT` in backend `.env`
- Update `CORS_ORIGIN` if needed

### Module Not Found
- Run `npm install` in all directories (backend, frontend, shared)
- Build shared package: `cd shared && npm run build`

### Stripe Errors
- Use test keys from Stripe dashboard
- For webhooks, use Stripe CLI: `stripe listen --forward-to localhost:3001/api/payments/webhook`

## Next Steps

- Read [SETUP.md](./docs/SETUP.md) for detailed setup
- Check [API.md](./docs/API.md) for API documentation
- Review [FEATURES.md](./docs/FEATURES.md) for feature list

Happy coding! 🚀

