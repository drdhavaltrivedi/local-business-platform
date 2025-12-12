import { Router, Response } from 'express';
import { ReviewService } from '../services/reviewService';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { UserRole } from '../../../shared/types';
import { body, validationResult } from 'express-validator';

const router = Router();
const reviewService = new ReviewService();

// Create review (customer only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.CUSTOMER, UserRole.ADMIN),
  [
    body('redemptionId').notEmpty(),
    body('merchantId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get customer ID
      const { pool } = await import('../config/database');
      const customerResult = await pool.query(
        'SELECT id FROM customers WHERE user_id = $1',
        [req.user!.userId]
      );

      if (customerResult.rows.length === 0) {
        return res.status(403).json({ error: 'Customer profile not found' });
      }

      const review = await reviewService.createReview({
        ...req.body,
        customerId: customerResult.rows[0].id,
      });

      res.status(201).json({ review });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get merchant reviews
router.get('/merchant/:merchantId', async (req, res: Response) => {
  try {
    const reviews = await reviewService.getMerchantReviews(req.params.merchantId);
    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Approve review (admin only)
router.post(
  '/:id/approve',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const review = await reviewService.approveReview(req.params.id);
      res.json({ review });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Reject review (admin only)
router.post(
  '/:id/reject',
  authenticate,
  authorize(UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const review = await reviewService.rejectReview(req.params.id);
      res.json({ review });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Create merchant rating (salesperson only)
router.post(
  '/merchant-rating',
  authenticate,
  authorize(UserRole.SALESPERSON, UserRole.ADMIN),
  [
    body('merchantId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get salesperson ID
      const { pool } = await import('../config/database');
      const salespersonResult = await pool.query(
        'SELECT id FROM salespeople WHERE user_id = $1',
        [req.user!.userId]
      );

      if (salespersonResult.rows.length === 0) {
        return res.status(403).json({ error: 'Salesperson profile not found' });
      }

      const rating = await reviewService.createMerchantRating({
        ...req.body,
        salespersonId: salespersonResult.rows[0].id,
      });

      res.status(201).json({ rating });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get merchant ratings
router.get('/merchant/:merchantId/ratings', async (req, res: Response) => {
  try {
    const ratings = await reviewService.getMerchantRatings(req.params.merchantId);
    const average = await reviewService.getAverageMerchantRating(req.params.merchantId);
    res.json({ ratings, average });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

