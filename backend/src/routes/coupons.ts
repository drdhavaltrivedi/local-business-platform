import { Router, Response, Request } from 'express';
import { CouponService } from '../services/couponService';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { UserRole } from '../../../shared/types';
import { body, query, validationResult } from 'express-validator';

const router = Router();
const couponService = new CouponService();

// Get coupons (public with filters)
router.get(
  '/',
  [
    query('category').optional().trim(),
    query('status').optional().isIn(['draft', 'pending_approval', 'active', 'expired', 'disabled']),
    query('zipCode').optional().trim(),
    query('isPlatinumOnly').optional().isBoolean(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const coupons = await couponService.getCoupons({
        category: req.query.category as string,
        status: req.query.status as any,
        zipCode: req.query.zipCode as string,
        isPlatinumOnly: req.query.isPlatinumOnly === 'true',
      });

      res.json({ coupons });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get single coupon
router.get('/:id', async (req, res: Response) => {
  try {
    const coupon = await couponService.getCouponById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json({ coupon });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create coupon (merchant only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.MERCHANT, UserRole.ADMIN),
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('discountType').isIn(['percentage', 'fixed']),
    body('discountValue').isFloat({ min: 0 }),
    body('category').trim().notEmpty(),
    body('termsAndConditions').trim().notEmpty(),
    body('validFrom').isISO8601(),
    body('validUntil').isISO8601(),
    body('isPlatinumOnly').isBoolean(),
    body('requiresGPS').isBoolean(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get merchant ID from user
      const { pool } = await import('../config/database');
      const merchantResult = await pool.query(
        'SELECT id FROM merchants WHERE user_id = $1',
        [req.user!.userId]
      );

      if (merchantResult.rows.length === 0) {
        return res.status(403).json({ error: 'Merchant profile not found' });
      }

      const merchantId = merchantResult.rows[0].id;
      const coupon = await couponService.createCoupon(merchantId, req.body);
      res.status(201).json({ coupon });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Redeem coupon (customer only)
router.post(
  '/:id/redeem',
  authenticate,
  authorize(UserRole.CUSTOMER, UserRole.ADMIN),
  [
    body('latitude').optional().isFloat(),
    body('longitude').optional().isFloat(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get customer ID from user
      const { pool } = await import('../config/database');
      const customerResult = await pool.query(
        'SELECT id FROM customers WHERE user_id = $1',
        [req.user!.userId]
      );

      if (customerResult.rows.length === 0) {
        return res.status(403).json({ error: 'Customer profile not found' });
      }

      const customerId = customerResult.rows[0].id;
      const redemption = await couponService.redeemCoupon(
        req.params.id,
        customerId,
        req.body
      );

      res.status(201).json({ redemption });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Validate redemption (merchant only)
router.post(
  '/redemptions/:id/validate',
  authenticate,
  authorize(UserRole.MERCHANT, UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      // Get merchant ID from user
      const { pool } = await import('../config/database');
      const merchantResult = await pool.query(
        'SELECT id FROM merchants WHERE user_id = $1',
        [req.user!.userId]
      );

      if (merchantResult.rows.length === 0) {
        return res.status(403).json({ error: 'Merchant profile not found' });
      }

      const merchantId = merchantResult.rows[0].id;
      const redemption = await couponService.validateRedemption(
        req.params.id,
        merchantId
      );

      res.json({ redemption });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;

