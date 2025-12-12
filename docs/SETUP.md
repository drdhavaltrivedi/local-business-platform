# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Stripe account (for payments)

## Database Setup

1. Create a PostgreSQL database:
```bash
createdb local_business_platform
```

2. Update database credentials in `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=local_business_platform
DB_USER=your_username
DB_PASSWORD=your_password
```

3. Run migrations:
```bash
cd backend
npm install
npm run build
node dist/migrations/run.js
```

Or manually run the SQL file:
```bash
psql -U your_username -d local_business_platform -f src/migrations/001_initial_schema.sql
```

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
   - Database credentials
   - JWT secret (generate a strong random string)
   - Stripe keys (from your Stripe dashboard)
   - CORS origin (frontend URL)

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Shared Package Setup

1. Navigate to shared directory:
```bash
cd shared
```

2. Install dependencies:
```bash
npm install
```

3. Build the package:
```bash
npm run build
```

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Add them to `backend/.env`:
   - `STRIPE_SECRET_KEY`: Your secret key (starts with `sk_`)
   - `STRIPE_WEBHOOK_SECRET`: Webhook secret (for production)

4. Set up webhook endpoint in Stripe dashboard:
   - URL: `https://your-domain.com/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## Testing the Setup

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Register a new account
4. Try logging in

## Production Deployment

### Backend

1. Build the backend:
```bash
cd backend
npm run build
```

2. Set environment variables on your hosting platform
3. Run migrations on production database
4. Start with: `npm start`

### Frontend

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### CORS Errors
- Update `CORS_ORIGIN` in backend `.env` to match frontend URL
- Check that backend is running

### Stripe Payment Issues
- Verify Stripe keys are correct
- Check webhook endpoint is configured
- Use Stripe test mode for development

### TypeScript Errors
- Run `npm install` in all directories
- Ensure shared package is built: `cd shared && npm run build`

