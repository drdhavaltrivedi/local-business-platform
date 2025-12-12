import { Router, Response, Request } from 'express';
import { PaymentService } from '../services/paymentService';
import { authenticate, AuthRequest } from '../middleware/auth';
import { PaymentType } from '../../../shared/types';
import { body, validationResult } from 'express-validator';

const router = Router();
const paymentService = new PaymentService();

// Create payment intent
router.post(
  '/create-intent',
  authenticate,
  [
    body('type').isIn(['subscription', 'merchant_plan', 'fundraiser_booklet']),
    body('amount').isFloat({ min: 0.01 }),
    body('metadata').optional().isObject(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, amount, metadata } = req.body;
      const result = await paymentService.createPaymentIntent(
        req.user!.userId,
        type as PaymentType,
        amount,
        metadata
      );

      res.json({
        clientSecret: result.paymentIntent.client_secret,
        payment: result.payment,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Stripe webhook
router.post(
  '/webhook',
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;

    if (!sig) {
      return res.status(400).json({ error: 'No signature' });
    }

    try {
      await paymentService.handleWebhook(sig, req.body);
      res.json({ received: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;

