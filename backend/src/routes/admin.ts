import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { UserRole, CouponStatus } from '../../../shared/types';
import { body, query, validationResult } from 'express-validator';
import { pool } from '../config/database';
import { CouponService } from '../services/couponService';
import { UserService } from '../services/userService';

const router = Router();
const couponService = new CouponService();
const userService = new UserService();

// Get all users
router.get(
  '/users',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, roles, status, created_at FROM users ORDER BY created_at DESC'
      );
      res.json({ users: result.rows });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Activate user
router.post(
  '/users/:id/activate',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      await userService.activateUser(req.params.id);
      const user = await userService.getUserById(req.params.id);
      res.json({ user: { ...user, passwordHash: undefined } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get pending coupons for approval
router.get(
  '/coupons/pending',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const coupons = await couponService.getCoupons({
        status: CouponStatus.PENDING_APPROVAL,
      });
      res.json({ coupons });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Approve coupon
router.post(
  '/coupons/:id/approve',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      await pool.query(
        'UPDATE coupons SET status = $1, updated_at = NOW() WHERE id = $2',
        [CouponStatus.ACTIVE, req.params.id]
      );
      const coupon = await couponService.getCouponById(req.params.id);
      res.json({ coupon });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Reject coupon
router.post(
  '/coupons/:id/reject',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      await pool.query(
        'UPDATE coupons SET status = $1, updated_at = NOW() WHERE id = $2',
        [CouponStatus.DISABLED, req.params.id]
      );
      const coupon = await couponService.getCouponById(req.params.id);
      res.json({ coupon });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get analytics
router.get(
  '/analytics',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const [
        totalUsers,
        totalMerchants,
        totalCoupons,
        totalRedemptions,
        totalRevenue,
      ] = await Promise.all([
        pool.query('SELECT COUNT(*) as count FROM users'),
        pool.query('SELECT COUNT(*) as count FROM merchants'),
        pool.query('SELECT COUNT(*) as count FROM coupons'),
        pool.query('SELECT COUNT(*) as count FROM redemptions WHERE status = $1', ['validated']),
        pool.query('SELECT SUM(amount) as total FROM payments WHERE status = $1', ['completed']),
      ]);

      res.json({
        analytics: {
          totalUsers: parseInt(totalUsers.rows[0].count),
          totalMerchants: parseInt(totalMerchants.rows[0].count),
          totalCoupons: parseInt(totalCoupons.rows[0].count),
          totalRedemptions: parseInt(totalRedemptions.rows[0].count),
          totalRevenue: parseFloat(totalRevenue.rows[0].total || '0'),
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

