# Features Documentation

## Implemented Features

### 1. Role-Based Account System ✅
- **User Roles**: User, Customer, Merchant, Salesperson, Regional Owner, Fundraiser, Admin
- **Authentication**: JWT-based secure authentication
- **Authorization**: Role-based access control middleware
- **Status Management**: Pending, Active, Inactive, Suspended states
- **Auto-activation**: Based on payments and agreements

### 2. Coupon Creation & Redemption ✅
- **Merchant Coupon Creation**: Full coupon management with rules and limits
- **GPS Validation**: Location-based redemption verification
- **Redemption Codes**: Unique 8-character codes generated per redemption
- **Status Tracking**: Draft, Pending Approval, Active, Expired, Disabled
- **Real-time Tracking**: Current redemption counts and limits
- **Platinum Tiers**: Support for premium coupon access

### 3. Merchant & Sales Enablement ✅
- **Merchant Onboarding**: Digital profile creation
- **Agreement Signing**: Digital agreement workflow
- **Salesperson Assignment**: Link merchants to salespeople
- **Regional Ownership**: ZIP code-based regional management
- **Commission Tracking**: Foundation for commission calculations

### 4. Customer Access & Subscriptions ✅
- **Subscription Tiers**: Basic and Platinum levels
- **Coupon Search**: Filter by location, category, availability
- **GPS-based Redemption**: Automatic location validation
- **Subscription Management**: Payment-based activation

### 5. Fundraiser Program ✅
- **E-booklet Creation**: Custom coupon booklets for fundraisers
- **Bulk Customer Upload**: CSV import for customer management
- **One-year Validity**: Automatic expiration date calculation
- **Customer Management**: Track booklet sales and activations

### 6. Payments & Automation ✅
- **Stripe Integration**: Payment processing via Stripe
- **Payment Intents**: Secure payment flow
- **Webhook Handling**: Automatic activation on payment success
- **Multiple Payment Types**: Subscriptions, merchant plans, fundraiser booklets
- **Auto-activation**: Post-payment user/merchant activation

### 7. Reviews & Quality Control ✅
- **Customer Reviews**: Post-redemption feedback system
- **Merchant Ratings**: Salesperson ratings of merchants
- **Review Moderation**: Admin approval workflow
- **Average Ratings**: Automatic calculation and display

### 8. Admin & Reporting ✅
- **User Management**: View and activate users
- **Coupon Approval**: Approve/reject pending coupons
- **Analytics Dashboard**: Key metrics overview
  - Total users, merchants, coupons
  - Total redemptions
  - Total revenue
- **Role Management**: View user roles and statuses

## Frontend Features

### PWA Capabilities
- **Service Worker**: Offline support and caching
- **Manifest**: Installable app experience
- **Responsive Design**: Mobile-first approach

### User Interfaces
- **Login/Register**: Authentication flows
- **Role-based Dashboards**: 
  - Customer: Browse and redeem coupons
  - Merchant: Create and manage coupons
  - Salesperson: View assigned merchants
  - Admin: Full management interface
- **Review System**: Submit and view reviews
- **Payment Integration**: Stripe payment forms

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Coupons
- `GET /api/coupons` - List coupons (with filters)
- `GET /api/coupons/:id` - Get coupon details
- `POST /api/coupons` - Create coupon (Merchant)
- `POST /api/coupons/:id/redeem` - Redeem coupon (Customer)
- `POST /api/coupons/redemptions/:id/validate` - Validate redemption (Merchant)

### Merchants
- `POST /api/merchants` - Create merchant profile
- `GET /api/merchants/me` - Get current merchant
- `POST /api/merchants/me/agreement` - Sign agreement
- `GET /api/merchants` - List merchants (Admin/Salesperson)

### Fundraisers
- `POST /api/fundraisers` - Create fundraiser profile
- `POST /api/fundraisers/booklets` - Create booklet
- `POST /api/fundraisers/booklets/:id/customers/upload` - Upload customers CSV
- `GET /api/fundraisers/booklets` - List booklets
- `GET /api/fundraisers/booklets/:id/customers` - List booklet customers

### Reviews
- `POST /api/reviews` - Create review (Customer)
- `GET /api/reviews/merchant/:id` - Get merchant reviews
- `POST /api/reviews/:id/approve` - Approve review (Admin)
- `POST /api/reviews/:id/reject` - Reject review (Admin)
- `POST /api/reviews/merchant-rating` - Rate merchant (Salesperson)
- `GET /api/reviews/merchant/:id/ratings` - Get merchant ratings

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/webhook` - Stripe webhook handler

### Admin
- `GET /api/admin/users` - List all users
- `POST /api/admin/users/:id/activate` - Activate user
- `GET /api/admin/coupons/pending` - Get pending coupons
- `POST /api/admin/coupons/:id/approve` - Approve coupon
- `POST /api/admin/coupons/:id/reject` - Reject coupon
- `GET /api/admin/analytics` - Get analytics

## Database Schema

### Core Tables
- `users` - User accounts with roles
- `customers` - Customer profiles and subscriptions
- `merchants` - Merchant business information
- `salespeople` - Salesperson profiles
- `regional_owners` - Regional owner information
- `fundraisers` - Fundraiser organization details

### Business Tables
- `coupons` - Coupon definitions
- `redemptions` - Coupon redemption records
- `payments` - Payment transactions
- `subscriptions` - Customer subscriptions
- `reviews` - Customer reviews
- `merchant_ratings` - Salesperson merchant ratings
- `fundraiser_booklets` - Fundraiser coupon booklets
- `fundraiser_customers` - Fundraiser customer assignments

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Role-based Authorization**: Middleware protection
- **Input Validation**: Express-validator on all endpoints
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Controlled cross-origin access

## Future Enhancements

### Planned Features
1. **30-second Authentication Animation**: Live redemption animation
2. **Commission Calculations**: Automatic commission tracking
3. **Regional Owner Dashboard**: ZIP code management interface
4. **Advanced Analytics**: Charts and detailed reporting
5. **Email Notifications**: Welcome emails, redemption confirmations
6. **SMS Notifications**: Redemption codes via SMS
7. **Document Management**: Agreement storage and retrieval
8. **Import Tools**: Bulk data import utilities
9. **Dispute Resolution**: Admin dispute management
10. **Mobile Apps**: Native iOS/Android apps

