# API Documentation

## Base URL
`http://localhost:3001/api`

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "role": "customer"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "roles": ["user", "customer"],
    "status": "pending"
  }
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt_token"
}
```

#### GET /auth/me
Get current user information.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": { ... }
}
```

### Coupons

#### GET /coupons
Get list of coupons with optional filters.

**Query Parameters:**
- `category` (optional): Filter by category
- `status` (optional): Filter by status
- `zipCode` (optional): Filter by ZIP code
- `isPlatinumOnly` (optional): Filter platinum-only coupons

**Response:**
```json
{
  "coupons": [
    {
      "id": "uuid",
      "merchantId": "uuid",
      "title": "20% Off",
      "description": "Get 20% off your purchase",
      "discountType": "percentage",
      "discountValue": 20,
      "category": "restaurant",
      "status": "active",
      "validFrom": "2024-01-01T00:00:00Z",
      "validUntil": "2024-12-31T23:59:59Z"
    }
  ]
}
```

#### GET /coupons/:id
Get a specific coupon by ID.

#### POST /coupons
Create a new coupon (Merchant only).

**Request Body:**
```json
{
  "title": "20% Off",
  "description": "Get 20% off your purchase",
  "discountType": "percentage",
  "discountValue": 20,
  "category": "restaurant",
  "termsAndConditions": "Valid for dine-in only",
  "validFrom": "2024-01-01T00:00:00Z",
  "validUntil": "2024-12-31T23:59:59Z",
  "maxRedemptions": 100,
  "isPlatinumOnly": false,
  "requiresGPS": true,
  "latitude": 40.7128,
  "longitude": -74.0060,
  "radiusMeters": 100
}
```

#### POST /coupons/:id/redeem
Redeem a coupon (Customer only).

**Request Body:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060
}
```

**Response:**
```json
{
  "redemption": {
    "id": "uuid",
    "couponId": "uuid",
    "customerId": "uuid",
    "redemptionCode": "ABC12345",
    "status": "pending"
  }
}
```

#### POST /coupons/redemptions/:id/validate
Validate a redemption (Merchant only).

### Payments

#### POST /payments/create-intent
Create a Stripe payment intent.

**Request Body:**
```json
{
  "type": "subscription",
  "amount": 29.99,
  "metadata": {
    "tier": "platinum",
    "months": 1
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "payment": {
    "id": "uuid",
    "status": "pending"
  }
}
```

#### POST /payments/webhook
Stripe webhook endpoint (handles payment events).

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message"
}
```

Common status codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

