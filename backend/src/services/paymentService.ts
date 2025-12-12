import Stripe from 'stripe';
import { pool } from '../config/database';
import { config } from '../config/env';
import { PaymentType, PaymentStatus, Payment } from '../../../shared/types';

const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2023-10-16',
});

export class PaymentService {
  async createPaymentIntent(
    userId: string,
    type: PaymentType,
    amount: number,
    metadata?: Record<string, any>
  ): Promise<{ paymentIntent: Stripe.PaymentIntent; payment: Payment }> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId,
        type,
        ...metadata,
      },
    });

    // Create payment record
    const result = await pool.query(
      `INSERT INTO payments (user_id, type, amount, currency, status, stripe_payment_intent_id, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        userId,
        type,
        amount,
        'usd',
        PaymentStatus.PENDING,
        paymentIntent.id,
        JSON.stringify(metadata || {}),
      ]
    );

    return {
      paymentIntent,
      payment: this.mapPayment(result.rows[0]),
    };
  }

  async handleWebhook(signature: string, body: string): Promise<void> {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        config.stripeWebhookSecret
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const result = await pool.query(
      'SELECT * FROM payments WHERE stripe_payment_intent_id = $1',
      [paymentIntent.id]
    );

    if (result.rows.length === 0) {
      console.error(`Payment not found for intent: ${paymentIntent.id}`);
      return;
    }

    const payment = this.mapPayment(result.rows[0]);

    // Update payment status
    await pool.query(
      `UPDATE payments 
       SET status = $1, completed_at = NOW(), updated_at = NOW()
       WHERE id = $2`,
      [PaymentStatus.COMPLETED, payment.id]
    );

    // Handle activation based on payment type
    await this.activateBasedOnPaymentType(payment);
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    await pool.query(
      `UPDATE payments 
       SET status = $1, updated_at = NOW()
       WHERE stripe_payment_intent_id = $2`,
      [PaymentStatus.FAILED, paymentIntent.id]
    );
  }

  private async activateBasedOnPaymentType(payment: Payment): Promise<void> {
    switch (payment.type) {
      case PaymentType.SUBSCRIPTION:
        await this.activateCustomerSubscription(payment.userId, payment.metadata);
        break;
      case PaymentType.MERCHANT_PLAN:
        await this.activateMerchant(payment.userId);
        break;
      case PaymentType.FUNDRAISER_BOOKLET:
        await this.activateFundraiserBooklet(payment.userId, payment.metadata);
        break;
    }
  }

  private async activateCustomerSubscription(
    userId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const tier = metadata?.tier || 'basic';
    const months = metadata?.months || 1;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    // Create or update subscription
    await pool.query(
      `INSERT INTO subscriptions (customer_id, tier, status, starts_at, expires_at)
       VALUES ($1, $2, 'active', NOW(), $3)
       ON CONFLICT (customer_id) 
       DO UPDATE SET tier = $2, status = 'active', expires_at = $3, updated_at = NOW()`,
      [userId, tier, expiresAt]
    );

    // Activate customer if not already active
    await pool.query(
      `UPDATE customers SET subscription_tier = $1, subscription_expires_at = $2
       WHERE user_id = $3`,
      [tier, expiresAt, userId]
    );
  }

  private async activateMerchant(userId: string): Promise<void> {
    // Activate merchant
    await pool.query(
      `UPDATE merchants SET status = 'active', activated_at = NOW()
       WHERE user_id = $1`,
      [userId]
    );

    // Activate user
    await pool.query(
      `UPDATE users SET status = 'active', updated_at = NOW()
       WHERE id = $1`,
      [userId]
    );
  }

  private async activateFundraiserBooklet(
    userId: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const bookletId = metadata?.bookletId;
    if (!bookletId) return;

    // Activate fundraiser customers
    await pool.query(
      `UPDATE fundraiser_customers 
       SET activated_at = NOW()
       WHERE booklet_id = $1 AND fundraiser_id = $2`,
      [bookletId, userId]
    );
  }

  private mapPayment(row: any): Payment {
    return {
      id: row.id,
      userId: row.user_id,
      type: row.type,
      amount: parseFloat(row.amount),
      currency: row.currency,
      status: row.status,
      stripePaymentIntentId: row.stripe_payment_intent_id,
      metadata: row.metadata ? JSON.parse(row.metadata) : {},
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

