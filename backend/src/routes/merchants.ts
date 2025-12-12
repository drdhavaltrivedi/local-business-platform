import { Router, Response } from 'express';
import { MerchantService } from '../services/merchantService';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { UserRole } from '../../../shared/types';
import { body, query, validationResult } from 'express-validator';

const router = Router();
const merchantService = new MerchantService();

// Create merchant profile
router.post(
  '/',
  authenticate,
  authorize(UserRole.MERCHANT, UserRole.ADMIN),
  [
    body('businessName').trim().notEmpty(),
    body('businessType').trim().notEmpty(),
    body('address').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('state').trim().notEmpty(),
    body('zipCode').trim().notEmpty(),
    body('latitude').isFloat(),
    body('longitude').isFloat(),
    body('phone').trim().notEmpty(),
    body('email').isEmail(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const merchant = await merchantService.createMerchant(
        req.user!.userId,
        req.body
      );
      res.status(201).json({ merchant });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get current merchant
router.get(
  '/me',
  authenticate,
  authorize(UserRole.MERCHANT, UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const merchant = await merchantService.getMerchantByUserId(req.user!.userId);
      if (!merchant) {
        return res.status(404).json({ error: 'Merchant profile not found' });
      }
      res.json({ merchant });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Sign agreement
router.post(
  '/me/agreement',
  authenticate,
  authorize(UserRole.MERCHANT, UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const merchant = await merchantService.getMerchantByUserId(req.user!.userId);
      if (!merchant) {
        return res.status(404).json({ error: 'Merchant profile not found' });
      }

      const updatedMerchant = await merchantService.signAgreement(
        merchant.id,
        req.user!.userId
      );
      res.json({ merchant: updatedMerchant });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get all merchants (admin/salesperson)
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SALESPERSON),
  [
    query('status').optional().isIn(['pending', 'active', 'inactive', 'suspended']),
    query('zipCode').optional().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const filters: any = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.zipCode) filters.zipCode = req.query.zipCode;

      // If salesperson, filter by their assigned merchants
      if (req.user!.roles.includes(UserRole.SALESPERSON)) {
        const { pool } = await import('../config/database');
        const salespersonResult = await pool.query(
          'SELECT id FROM salespeople WHERE user_id = $1',
          [req.user!.userId]
        );
        if (salespersonResult.rows.length > 0) {
          filters.salespersonId = salespersonResult.rows[0].id;
        }
      }

      const merchants = await merchantService.getAllMerchants(filters);
      res.json({ merchants });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

