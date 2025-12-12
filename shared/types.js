"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewStatus = exports.PaymentType = exports.PaymentStatus = exports.RedemptionStatus = exports.CouponStatus = exports.SubscriptionTier = exports.UserStatus = exports.UserRole = void 0;
// User Roles
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "user";
    UserRole["CUSTOMER"] = "customer";
    UserRole["MERCHANT"] = "merchant";
    UserRole["SALESPERSON"] = "salesperson";
    UserRole["REGIONAL_OWNER"] = "regional_owner";
    UserRole["FUNDRAISER"] = "fundraiser";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
// User Status
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING"] = "pending";
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
// Subscription Tiers
var SubscriptionTier;
(function (SubscriptionTier) {
    SubscriptionTier["BASIC"] = "basic";
    SubscriptionTier["PLATINUM"] = "platinum";
})(SubscriptionTier || (exports.SubscriptionTier = SubscriptionTier = {}));
// Coupon Status
var CouponStatus;
(function (CouponStatus) {
    CouponStatus["DRAFT"] = "draft";
    CouponStatus["PENDING_APPROVAL"] = "pending_approval";
    CouponStatus["ACTIVE"] = "active";
    CouponStatus["EXPIRED"] = "expired";
    CouponStatus["DISABLED"] = "disabled";
})(CouponStatus || (exports.CouponStatus = CouponStatus = {}));
// Redemption Status
var RedemptionStatus;
(function (RedemptionStatus) {
    RedemptionStatus["PENDING"] = "pending";
    RedemptionStatus["VALIDATED"] = "validated";
    RedemptionStatus["REJECTED"] = "rejected";
    RedemptionStatus["EXPIRED"] = "expired";
})(RedemptionStatus || (exports.RedemptionStatus = RedemptionStatus = {}));
// Payment Status
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["COMPLETED"] = "completed";
    PaymentStatus["FAILED"] = "failed";
    PaymentStatus["REFUNDED"] = "refunded";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
// Payment Type
var PaymentType;
(function (PaymentType) {
    PaymentType["SUBSCRIPTION"] = "subscription";
    PaymentType["MERCHANT_PLAN"] = "merchant_plan";
    PaymentType["FUNDRAISER_BOOKLET"] = "fundraiser_booklet";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
// Review Status
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "pending";
    ReviewStatus["APPROVED"] = "approved";
    ReviewStatus["REJECTED"] = "rejected";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
