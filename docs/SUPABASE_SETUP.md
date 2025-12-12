# Supabase Setup Guide

## ✅ Database Schema Applied

The database schema has been successfully applied to your Supabase project!

**Project URL**: https://gielnjqmgxlxihqmjjre.supabase.co

## Getting Your Database Password

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/gielnjqmgxlxihqmjjre
2. Navigate to **Settings** → **Database**
3. Scroll down to **Connection string** section
4. Copy the **Connection string** (URI format) or note the **Password**

## Update Backend Configuration

### Option 1: Using Connection String (Recommended)

Edit `backend/.env` and set:

```env
DATABASE_URL=postgresql://postgres.gielnjqmgxlxihqmjjre:[YOUR_PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

### Option 2: Using Individual Parameters

Edit `backend/.env` and set:

```env
DB_HOST=db.gielnjqmgxlxihqmjjre.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[YOUR_PASSWORD_FROM_DASHBOARD]
```

## Table Names

All tables are prefixed with `lbp_` to avoid conflicts:
- `lbp_users`
- `lbp_customers`
- `lbp_merchants`
- `lbp_coupons`
- `lbp_redemptions`
- `lbp_payments`
- `lbp_subscriptions`
- `lbp_reviews`
- `lbp_fundraisers`
- etc.

## Verify Connection

After updating `.env`, test the connection:

```bash
cd backend
npm run dev
```

You should see "Database connected" in the logs.

## API Keys

Your Supabase project API keys:
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpZWxuanFtZ3hseGlocW1qanJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNTkzMDIsImV4cCI6MjA4MDkzNTMwMn0.wav4XIWXO-jCL9ZqbJO_LDJ__WKn-6JeAgWoGnlptrE`
- **Publishable Key**: `sb_publishable_rFwDmP-__CRfESxshgTwHw_TiWHGvPu`

## Next Steps

1. Update `backend/.env` with your database password
2. Restart the backend server
3. Test the API endpoints
4. Start using the platform!

## Troubleshooting

### Connection Errors

- Verify the password is correct
- Check that SSL is enabled (already configured)
- Ensure the host is `db.gielnjqmgxlxihqmjjre.supabase.co`

### Table Not Found Errors

- All tables use `lbp_` prefix
- Verify migration was applied: Check Supabase dashboard → Database → Tables

