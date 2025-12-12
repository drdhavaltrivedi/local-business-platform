import { pool } from '../config/database';
import {
  Coupon,
  CouponStatus,
  CreateCouponRequest,
  RedeemCouponRequest,
  Redemption,
  RedemptionStatus,
} from '../../../shared/types';
import { validateGPSLocation, generateRedemptionCode } from '../utils/gps';

export class CouponService {
  async createCoupon(merchantId: string, data: CreateCouponRequest): Promise<Coupon> {
    const result = await pool.query(
      `INSERT INTO coupons (
        merchant_id, title, description, discount_type, discount_value,
        min_purchase_amount, max_discount_amount, category, terms_and_conditions,
        valid_from, valid_until, max_redemptions, status, is_platinum_only,
        requires_gps, latitude, longitude, radius_meters
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        merchantId,
        data.title,
        data.description,
        data.discountType,
        data.discountValue,
        data.minPurchaseAmount || null,
        data.maxDiscountAmount || null,
        data.category,
        data.termsAndConditions,
        data.validFrom,
        data.validUntil,
        data.maxRedemptions || null,
        CouponStatus.PENDING_APPROVAL,
        data.isPlatinumOnly,
        data.requiresGPS,
        data.latitude || null,
        data.longitude || null,
        data.radiusMeters || null,
      ]
    );

    return this.mapCoupon(result.rows[0]);
  }

  async getCoupons(filters?: {
    merchantId?: string;
    category?: string;
    status?: CouponStatus;
    isPlatinumOnly?: boolean;
    zipCode?: string;
  }): Promise<Coupon[]> {
    let query = 'SELECT c.* FROM coupons c';
    const conditions: string[] = [];
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.merchantId) {
      conditions.push(`c.merchant_id = $${paramCount++}`);
      params.push(filters.merchantId);
    }

    if (filters?.category) {
      conditions.push(`c.category = $${paramCount++}`);
      params.push(filters.category);
    }

    if (filters?.status) {
      conditions.push(`c.status = $${paramCount++}`);
      params.push(filters.status);
    }

    if (filters?.isPlatinumOnly !== undefined) {
      conditions.push(`c.is_platinum_only = $${paramCount++}`);
      params.push(filters.isPlatinumOnly);
    }

    if (filters?.zipCode) {
      query += ' JOIN merchants m ON c.merchant_id = m.id';
      conditions.push(`m.zip_code = $${paramCount++}`);
      params.push(filters.zipCode);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY c.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows.map((row) => this.mapCoupon(row));
  }

  async getCouponById(id: string): Promise<Coupon | null> {
    const result = await pool.query('SELECT * FROM coupons WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this.mapCoupon(result.rows[0]);
  }

  async redeemCoupon(
    couponId: string,
    customerId: string,
    data: RedeemCouponRequest
  ): Promise<Redemption> {
    // Get coupon and merchant info
    const couponResult = await pool.query(
      `SELECT c.*, m.latitude as merchant_lat, m.longitude as merchant_lon, m.id as merchant_id
       FROM coupons c
       JOIN merchants m ON c.merchant_id = m.id
       WHERE c.id = $1`,
      [couponId]
    );

    if (couponResult.rows.length === 0) {
      throw new Error('Coupon not found');
    }

    const coupon = this.mapCoupon(couponResult.rows[0]);
    const merchantLat = couponResult.rows[0].merchant_lat;
    const merchantLon = couponResult.rows[0].merchant_lon;
    const merchantId = couponResult.rows[0].merchant_id;

    // Validate coupon status
    if (coupon.status !== CouponStatus.ACTIVE) {
      throw new Error('Coupon is not active');
    }

    if (new Date() > coupon.validUntil) {
      throw new Error('Coupon has expired');
    }

    if (coupon.maxRedemptions && coupon.currentRedemptions >= coupon.maxRedemptions) {
      throw new Error('Coupon redemption limit reached');
    }

    // Validate GPS if required
    if (coupon.requiresGPS) {
      if (!data.latitude || !data.longitude) {
        throw new Error('GPS location required for redemption');
      }

      const validation = validateGPSLocation(
        data.latitude,
        data.longitude,
        merchantLat,
        merchantLon,
        coupon.radiusMeters || 100
      );

      if (!validation.isValid) {
        throw new Error(validation.message);
      }
    }

    // Create redemption
    const redemptionCode = generateRedemptionCode();
    const result = await pool.query(
      `INSERT INTO redemptions (
        coupon_id, customer_id, merchant_id, redemption_code, status,
        customer_latitude, customer_longitude, distance_from_merchant
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        couponId,
        customerId,
        merchantId,
        redemptionCode,
        RedemptionStatus.PENDING,
        data.latitude || null,
        data.longitude || null,
        coupon.requiresGPS && data.latitude && data.longitude
          ? validateGPSLocation(data.latitude, data.longitude, merchantLat, merchantLon).distance
          : null,
      ]
    );

    // Update coupon redemption count
    await pool.query(
      'UPDATE coupons SET current_redemptions = current_redemptions + 1 WHERE id = $1',
      [couponId]
    );

    return this.mapRedemption(result.rows[0]);
  }

  async validateRedemption(redemptionId: string, merchantId: string): Promise<Redemption> {
    const result = await pool.query(
      'SELECT * FROM redemptions WHERE id = $1 AND merchant_id = $2',
      [redemptionId, merchantId]
    );

    if (result.rows.length === 0) {
      throw new Error('Redemption not found');
    }

    const redemption = this.mapRedemption(result.rows[0]);

    if (redemption.status !== RedemptionStatus.PENDING) {
      throw new Error('Redemption already processed');
    }

    // Update redemption status
    await pool.query(
      'UPDATE redemptions SET status = $1, validated_at = NOW() WHERE id = $2',
      [RedemptionStatus.VALIDATED, redemptionId]
    );

    return { ...redemption, status: RedemptionStatus.VALIDATED, validatedAt: new Date() };
  }

  private mapCoupon(row: any): Coupon {
    return {
      id: row.id,
      merchantId: row.merchant_id,
      title: row.title,
      description: row.description,
      discountType: row.discount_type,
      discountValue: row.discount_value,
      minPurchaseAmount: row.min_purchase_amount,
      maxDiscountAmount: row.max_discount_amount,
      category: row.category,
      termsAndConditions: row.terms_and_conditions,
      validFrom: row.valid_from,
      validUntil: row.valid_until,
      maxRedemptions: row.max_redemptions,
      currentRedemptions: row.current_redemptions || 0,
      status: row.status,
      isPlatinumOnly: row.is_platinum_only,
      requiresGPS: row.requires_gps,
      latitude: row.latitude,
      longitude: row.longitude,
      radiusMeters: row.radius_meters,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapRedemption(row: any): Redemption {
    return {
      id: row.id,
      couponId: row.coupon_id,
      customerId: row.customer_id,
      merchantId: row.merchant_id,
      redemptionCode: row.redemption_code,
      status: row.status,
      redeemedAt: row.redeemed_at,
      validatedAt: row.validated_at,
      customerLatitude: row.customer_latitude,
      customerLongitude: row.customer_longitude,
      distanceFromMerchant: row.distance_from_merchant,
      notes: row.notes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

