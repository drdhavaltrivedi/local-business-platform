import { Router, Response } from 'express';
import { FundraiserService } from '../services/fundraiserService';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { UserRole } from '../../../shared/types';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import { parse } from 'csv-parse/sync';

const router = Router();
const fundraiserService = new FundraiserService();
const upload = multer({ storage: multer.memoryStorage() });

// Create fundraiser profile
router.post(
  '/',
  authenticate,
  authorize(UserRole.FUNDRAISER, UserRole.ADMIN),
  [
    body('organizationName').trim().notEmpty(),
    body('contactName').trim().notEmpty(),
    body('contactEmail').isEmail(),
    body('contactPhone').trim().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const fundraiser = await fundraiserService.createFundraiser(
        req.user!.userId,
        req.body
      );
      res.status(201).json({ fundraiser });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Create booklet
router.post(
  '/booklets',
  authenticate,
  authorize(UserRole.FUNDRAISER, UserRole.ADMIN),
  [
    body('name').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('couponIds').isArray(),
    body('validFrom').isISO8601(),
    body('validUntil').isISO8601(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Get fundraiser ID
      const { pool } = await import('../config/database');
      const fundraiserResult = await pool.query(
        'SELECT id FROM fundraisers WHERE user_id = $1',
        [req.user!.userId]
      );

      if (fundraiserResult.rows.length === 0) {
        return res.status(403).json({ error: 'Fundraiser profile not found' });
      }

      const booklet = await fundraiserService.createBooklet(
        fundraiserResult.rows[0].id,
        req.body
      );
      res.status(201).json({ booklet });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Upload customers via CSV
router.post(
  '/booklets/:bookletId/customers/upload',
  authenticate,
  authorize(UserRole.FUNDRAISER, UserRole.ADMIN),
  upload.single('file'),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Get fundraiser ID
      const { pool } = await import('../config/database');
      const fundraiserResult = await pool.query(
        'SELECT id FROM fundraisers WHERE user_id = $1',
        [req.user!.userId]
      );

      if (fundraiserResult.rows.length === 0) {
        return res.status(403).json({ error: 'Fundraiser profile not found' });
      }

      // Parse CSV
      const csvContent = req.file.buffer.toString('utf-8');
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
      });

      const customers = records.map((record: any) => ({
        email: record.email,
        firstName: record.firstName || record['First Name'],
        lastName: record.lastName || record['Last Name'],
      }));

      const uploadedCustomers = await fundraiserService.uploadCustomers(
        fundraiserResult.rows[0].id,
        req.params.bookletId,
        customers
      );

      res.status(201).json({
        message: `Successfully uploaded ${uploadedCustomers.length} customers`,
        customers: uploadedCustomers,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Get booklets
router.get(
  '/booklets',
  authenticate,
  authorize(UserRole.FUNDRAISER, UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const { pool } = await import('../config/database');
      const fundraiserResult = await pool.query(
        'SELECT id FROM fundraisers WHERE user_id = $1',
        [req.user!.userId]
      );

      if (fundraiserResult.rows.length === 0) {
        return res.status(403).json({ error: 'Fundraiser profile not found' });
      }

      const booklets = await fundraiserService.getFundraiserBooklets(
        fundraiserResult.rows[0].id
      );
      res.json({ booklets });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get booklet customers
router.get(
  '/booklets/:bookletId/customers',
  authenticate,
  authorize(UserRole.FUNDRAISER, UserRole.ADMIN),
  async (req: AuthRequest, res: Response) => {
    try {
      const customers = await fundraiserService.getBookletCustomers(
        req.params.bookletId
      );
      res.json({ customers });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

