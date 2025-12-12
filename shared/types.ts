// User Roles
export enum UserRole {
  USER = 'user',
  CUSTOMER = 'customer',
  MERCHANT = 'merchant',
  SALESPERSON = 'salesperson',
  REGIONAL_OWNER = 'regional_owner',
  FUNDRAISER = 'fundraiser',
  ADMIN = 'admin'
}

// User Status
export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

// Subscription Tiers
export enum SubscriptionTier {
  BASIC = 'basic',
  PLATINUM = 'platinum'
}

// Coupon Status
export enum CouponStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  DISABLED = 'disabled'
}

// Redemption Status
export enum RedemptionStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}

// Payment Status
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Payment Type
export enum PaymentType {
  SUBSCRIPTION = 'subscription',
  MERCHANT_PLAN = 'merchant_plan',
  FUNDRAISER_BOOKLET = 'fundraiser_booklet'
}

// Review Status
export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

// Core Types
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles: UserRole[];
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  userId: string;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: Date;
  zipCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Merchant {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string;
  status: UserStatus;
  activatedAt?: Date;
  salespersonId?: string;
  regionalOwnerId?: string;
  agreementSigned: boolean;
  agreementSignedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Salesperson {
  id: string;
  userId: string;
  commissionRate: number;
  totalEarnings: number;
  activatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegionalOwner {
  id: string;
  userId: string;
  zipCodes: string[];
  commissionRate: number;
  totalEarnings: number;
  activatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Fundraiser {
  id: string;
  userId: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  activatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coupon {
  id: string;
  merchantId: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  category: string;
  termsAndConditions: string;
  validFrom: Date;
  validUntil: Date;
  maxRedemptions?: number;
  currentRedemptions: number;
  status: CouponStatus;
  isPlatinumOnly: boolean;
  requiresGPS: boolean;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Redemption {
  id: string;
  couponId: string;
  customerId: string;
  merchantId: string;
  redemptionCode: string;
  status: RedemptionStatus;
  redeemedAt: Date;
  validatedAt?: Date;
  customerLatitude?: number;
  customerLongitude?: number;
  distanceFromMerchant?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  type: PaymentType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripePaymentIntentId?: string;
  metadata?: Record<string, any>;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  customerId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired';
  startsAt: Date;
  expiresAt: Date;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  redemptionId: string;
  customerId: string;
  merchantId: string;
  rating: number; // 1-5
  comment?: string;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface MerchantRating {
  id: string;
  merchantId: string;
  salespersonId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FundraiserBooklet {
  id: string;
  fundraiserId: string;
  name: string;
  description: string;
  price: number;
  couponIds: string[];
  validFrom: Date;
  validUntil: Date;
  totalSold: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FundraiserCustomer {
  id: string;
  fundraiserId: string;
  bookletId: string;
  customerId?: string;
  email: string;
  firstName: string;
  lastName: string;
  activatedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface CreateCouponRequest {
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  category: string;
  termsAndConditions: string;
  validFrom: Date;
  validUntil: Date;
  maxRedemptions?: number;
  isPlatinumOnly: boolean;
  requiresGPS: boolean;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
}

export interface RedeemCouponRequest {
  couponId: string;
  latitude?: number;
  longitude?: number;
}

export interface CreateMerchantRequest {
  businessName: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string;
}

export interface GPSValidationResult {
  isValid: boolean;
  distance?: number;
  message: string;
}

