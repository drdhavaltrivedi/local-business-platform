<div align="center">

# 🏪 Local Business Empowerment Platform

### A Modern Coupon-Based Digital Ecosystem

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

**Connecting local merchants, consumers, salespeople, and fundraisers in one unified platform**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

---

</div>

## 📖 About

The **Local Business Empowerment Platform** is a comprehensive digital ecosystem designed to strengthen local economies by creating a seamless connection between merchants, customers, salespeople, and fundraisers. Built with modern web technologies, it provides a secure, scalable, and user-friendly platform for managing coupons, subscriptions, payments, and business relationships.

### 🎯 Vision
> To build a locally united nation where supporting small businesses is simple, rewarding, and profitable for everyone involved.

### 🚀 Mission
> To create a secure and automated platform that empowers merchants with affordable advertising, helps customers save locally, enables individuals to earn through ethical sales, and supports meaningful fundraising efforts, all within a transparent and scalable system.

---

## ✨ Features

### 🔐 Role-Based Account System
- **Multi-role support**: User, Customer, Merchant, Salesperson, Regional Owner, Fundraiser, Admin
- **Secure authentication** with JWT tokens
- **Automated activation** based on agreements and payments
- **Role-specific dashboards** and access control

### 🎫 Coupon Management
- **Smart coupon creation** with flexible discount rules
- **GPS-based redemption** validation for location-specific offers
- **Real-time tracking** of redemptions and usage
- **Platinum tier** access for premium customers
- **30-second live authentication** animation

### 🏢 Merchant & Sales Enablement
- **Digital merchant onboarding** with streamlined process
- **Salesperson-led activation** with commission tracking
- **Regional ownership** by ZIP code
- **Business profile management** with location services

### 👥 Customer Experience
- **Subscription-based access** (Basic & Platinum tiers)
- **Advanced search** by location, category, and availability
- **Mobile-friendly PWA** for on-the-go access
- **Coupon browsing** and redemption tracking

### 💰 Fundraiser Program
- **Digital coupon booklets** for group sales
- **Bulk customer upload** via CSV
- **One-year coupon validity** for long-term campaigns
- **Donor-managed merchant selection**

### 💳 Payments & Automation
- **Stripe integration** for secure payments
- **Auto-activation** post payment
- **Subscription management** with recurring billing
- **Merchant plan payments** and fundraiser booklet sales

### ⭐ Reviews & Quality Control
- **Customer validation** after redemption
- **Merchant ratings** by salespeople
- **Admin dispute resolution** system
- **Quality assurance** mechanisms

### 🛠️ Admin & Reporting
- **User and role management** dashboard
- **Coupon approval** and monitoring tools
- **Import tools** and analytics
- **Document management** system

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React PWA)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Customer   │  │   Merchant   │  │    Admin     │     │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                            │                                 │
│                    ┌───────▼────────┐                        │
│                    │   API Client   │                        │
│                    │   (Axios)      │                        │
│                    └───────┬────────┘                        │
└────────────────────────────┼─────────────────────────────────┘
                             │ HTTP/REST API
                             │ (JWT Auth)
┌────────────────────────────▼─────────────────────────────────┐
│                   Backend (Express API)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Auth   │  │ Coupons  │  │ Payments │  │  Admin   │  │
│  │  Routes  │  │  Routes   │  │  Routes  │  │  Routes  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│         │            │            │            │            │
│         └────────────┼────────────┼────────────┘            │
│                      │            │                          │
│              ┌───────▼────────────▼───────┐                 │
│              │    Service Layer            │                 │
│              │  (Business Logic)           │                 │
│              └───────┬─────────────────────┘                 │
└──────────────────────┼──────────────────────────────────────┘
                       │ SQL Queries
┌──────────────────────▼──────────────────────────────────────┐
│              PostgreSQL Database                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │ Coupons  │  │ Payments │  │ Reviews  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/)) or **Docker**
- **npm** or **yarn**
- **Stripe Account** (optional, for payment features)

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/local-business-platform.git
cd local-business-platform
```

#### 2️⃣ Database Setup

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d postgres
```

**Option B: Local PostgreSQL**
```bash
createdb local_business_platform
```

#### 3️⃣ Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Build and run migrations
npm run build
node dist/migrations/run.js

# Start backend server
npm run dev
```

✅ Backend running on **http://localhost:3002**

#### 4️⃣ Shared Package

```bash
cd ../shared
npm install
npm run build
```

#### 5️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

✅ Frontend running on **http://localhost:5173**

#### 6️⃣ Create Test Accounts (Optional)

```bash
cd ../backend
npx tsx src/scripts/create-test-users.ts
```

---

## 🎮 Usage

### Starting the Application

**Terminal 1 - Database:**
```bash
docker-compose up -d postgres
```

**Terminal 2 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend && npm run dev
```

### Access Points

- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:3002
- ❤️ **Health Check**: http://localhost:3002/health

### Test Accounts

After running the test user script, you can log in with:

| 👤 Role | 📧 Email | 🔑 Password | 🎯 Access |
|---------|----------|-------------|----------|
| Customer | `customer@test.com` | `password123` | Browse & redeem coupons |
| Merchant | `merchant@test.com` | `password123` | Create coupons, manage business |
| Salesperson | `salesperson@test.com` | `password123` | Onboard merchants |
| Fundraiser | `fundraiser@test.com` | `password123` | Create booklets |
| Admin | `admin@test.com` | `password123` | Full system access |

---

## 📁 Project Structure

```
local-business-platform/
├── 📂 backend/                 # Backend API Server
│   ├── 📂 src/
│   │   ├── 📂 config/         # Configuration files
│   │   ├── 📂 middleware/      # Express middleware
│   │   ├── 📂 routes/          # API routes
│   │   ├── 📂 services/        # Business logic
│   │   ├── 📂 utils/           # Utility functions
│   │   └── 📂 migrations/      # Database migrations
│   └── package.json
│
├── 📂 frontend/                # React Frontend
│   ├── 📂 src/
│   │   ├── 📂 components/      # React components
│   │   ├── 📂 pages/           # Page components
│   │   ├── 📂 services/        # API services
│   │   ├── 📂 store/           # State management
│   │   └── 📂 types/           # TypeScript types
│   └── package.json
│
├── 📂 shared/                   # Shared Types & Utilities
│   ├── types.ts                # Shared TypeScript types
│   └── package.json
│
├── 📂 docs/                     # Documentation
│   ├── API.md                  # API documentation
│   ├── SETUP.md                # Setup guide
│   └── FEATURES.md             # Feature details
│
├── docker-compose.yml           # Docker configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **React Query** - Data fetching
- **PWA** - Progressive Web App support

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Stripe** - Payment processing
- **bcryptjs** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 📚 Documentation

- 📖 [Quick Start Guide](./QUICKSTART.md) - Get running in 5 minutes
- 🔧 [Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- 🔌 [API Documentation](./docs/API.md) - Complete API reference
- ✨ [Features](./docs/FEATURES.md) - Feature list and details
- 🗄️ [Database Schema](./backend/src/migrations/001_initial_schema.sql) - Database structure

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=3002
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
APP_URL=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=local_business_platform
DB_USER=user
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Stripe (Optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3002/api
```

---

## 🧪 Development

### Backend Commands

```bash
cd backend

npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Run production build
npm run migrate  # Run database migrations
```

### Frontend Commands

```bash
cd frontend

npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Shared Package Commands

```bash
cd shared

npm run build    # Build TypeScript types
npm run watch    # Watch mode for auto-rebuild
```

---

## 🐛 Troubleshooting

### Common Issues

<details>
<summary><b>Database Connection Error</b></summary>

**Problem**: `Connection refused` or `ECONNREFUSED`

**Solutions**:
- Verify PostgreSQL is running: `sudo systemctl status postgresql` or `docker-compose ps`
- Check database credentials in `backend/.env`
- Ensure database exists: `psql -l | grep local_business_platform`
- For Docker: Wait a few seconds after starting the container

</details>

<details>
<summary><b>Port Already in Use</b></summary>

**Problem**: `EADDRINUSE: address already in use`

**Solutions**:
- Change `PORT` in `backend/.env` to a different port
- Update `CORS_ORIGIN` and `VITE_API_URL` accordingly
- Kill the process: `lsof -ti:3002 | xargs kill`

</details>

<details>
<summary><b>Module Not Found</b></summary>

**Problem**: `Cannot find module '@shared/types'`

**Solutions**:
- Build the shared package: `cd shared && npm run build`
- Ensure path aliases are configured in `frontend/vite.config.ts`
- Restart the frontend dev server

</details>

<details>
<summary><b>Frontend Blank Screen</b></summary>

**Solutions**:
- Check browser console for errors
- Verify backend is running and accessible
- Check that shared package is built
- Clear browser cache and reload

</details>

---

## 🚢 Deployment

### Production Build

**Backend:**
```bash
cd backend
npm run build
NODE_ENV=production npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the dist/ folder with nginx, Apache, or similar
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for production domain
- [ ] Set up Stripe webhooks
- [ ] Enable database backups
- [ ] Set up monitoring and logging

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 👥 Authors

- **Dhaval Trivedi** - *Product Manager* - [DrDhaval Trivedi](https://github.com/drdhavaltrivedi)

---

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by the need to support local businesses
- Thanks to all contributors and users

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for local businesses

[⬆ Back to Top](#-local-business-empowerment-platform)

</div>
