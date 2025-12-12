import { pool } from '../config/database';
import { Review, MerchantRating, ReviewStatus } from '../../../shared/types';

export class ReviewService {
  async createReview(data: {
    redemptionId: string;
    customerId: string;
    merchantId: string;
    rating: number;
    comment?: string;
  }): Promise<Review> {
    // Verify redemption exists and belongs to customer
    const redemptionResult = await pool.query(
      'SELECT * FROM redemptions WHERE id = $1 AND customer_id = $2',
      [data.redemptionId, data.customerId]
    );

    if (redemptionResult.rows.length === 0) {
      throw new Error('Redemption not found or does not belong to customer');
    }

    const result = await pool.query(
      `INSERT INTO reviews (redemption_id, customer_id, merchant_id, rating, comment, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.redemptionId,
        data.customerId,
        data.merchantId,
        data.rating,
        data.comment || null,
        ReviewStatus.PENDING,
      ]
    );

    return this.mapReview(result.rows[0]);
  }

  async getMerchantReviews(merchantId: string): Promise<Review[]> {
    const result = await pool.query(
      `SELECT * FROM reviews 
       WHERE merchant_id = $1 AND status = $2
       ORDER BY created_at DESC`,
      [merchantId, ReviewStatus.APPROVED]
    );

    return result.rows.map((row) => this.mapReview(row));
  }

  async approveReview(reviewId: string): Promise<Review> {
    const result = await pool.query(
      `UPDATE reviews SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [ReviewStatus.APPROVED, reviewId]
    );

    if (result.rows.length === 0) {
      throw new Error('Review not found');
    }

    return this.mapReview(result.rows[0]);
  }

  async rejectReview(reviewId: string): Promise<Review> {
    const result = await pool.query(
      `UPDATE reviews SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [ReviewStatus.REJECTED, reviewId]
    );

    if (result.rows.length === 0) {
      throw new Error('Review not found');
    }

    return this.mapReview(result.rows[0]);
  }

  async createMerchantRating(data: {
    merchantId: string;
    salespersonId: string;
    rating: number;
    comment?: string;
  }): Promise<MerchantRating> {
    const result = await pool.query(
      `INSERT INTO merchant_ratings (merchant_id, salesperson_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        data.merchantId,
        data.salespersonId,
        data.rating,
        data.comment || null,
      ]
    );

    return this.mapMerchantRating(result.rows[0]);
  }

  async getMerchantRatings(merchantId: string): Promise<MerchantRating[]> {
    const result = await pool.query(
      'SELECT * FROM merchant_ratings WHERE merchant_id = $1 ORDER BY created_at DESC',
      [merchantId]
    );

    return result.rows.map((row) => this.mapMerchantRating(row));
  }

  async getAverageMerchantRating(merchantId: string): Promise<number> {
    const result = await pool.query(
      'SELECT AVG(rating) as avg_rating FROM merchant_ratings WHERE merchant_id = $1',
      [merchantId]
    );

    return parseFloat(result.rows[0]?.avg_rating || '0');
  }

  private mapReview(row: any): Review {
    return {
      id: row.id,
      redemptionId: row.redemption_id,
      customerId: row.customer_id,
      merchantId: row.merchant_id,
      rating: row.rating,
      comment: row.comment,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapMerchantRating(row: any): MerchantRating {
    return {
      id: row.id,
      merchantId: row.merchant_id,
      salespersonId: row.salesperson_id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

