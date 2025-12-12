import { pool } from '../config/database';
import {
  Fundraiser,
  FundraiserBooklet,
  FundraiserCustomer,
  UserStatus,
} from '../../../shared/types';

export class FundraiserService {
  async createFundraiser(userId: string, data: {
    organizationName: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  }): Promise<Fundraiser> {
    const result = await pool.query(
      `INSERT INTO fundraisers (user_id, organization_name, contact_name, contact_email, contact_phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userId,
        data.organizationName,
        data.contactName,
        data.contactEmail,
        data.contactPhone,
      ]
    );

    return this.mapFundraiser(result.rows[0]);
  }

  async createBooklet(fundraiserId: string, data: {
    name: string;
    description: string;
    price: number;
    couponIds: string[];
    validFrom: Date;
    validUntil: Date;
  }): Promise<FundraiserBooklet> {
    const result = await pool.query(
      `INSERT INTO fundraiser_booklets (
        fundraiser_id, name, description, price, coupon_ids, valid_from, valid_until
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        fundraiserId,
        data.name,
        data.description,
        data.price,
        data.couponIds,
        data.validFrom,
        data.validUntil,
      ]
    );

    return this.mapBooklet(result.rows[0]);
  }

  async uploadCustomers(
    fundraiserId: string,
    bookletId: string,
    customers: Array<{
      email: string;
      firstName: string;
      lastName: string;
    }>
  ): Promise<FundraiserCustomer[]> {
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // One year validity

    const insertedCustomers: FundraiserCustomer[] = [];

    for (const customer of customers) {
      // Try to find existing customer by email
      const customerResult = await pool.query(
        'SELECT id FROM customers WHERE user_id IN (SELECT id FROM users WHERE email = $1)',
        [customer.email]
      );

      let customerId = null;
      if (customerResult.rows.length > 0) {
        customerId = customerResult.rows[0].id;
      }

      const result = await pool.query(
        `INSERT INTO fundraiser_customers (
          fundraiser_id, booklet_id, customer_id, email, first_name, last_name, expires_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          fundraiserId,
          bookletId,
          customerId,
          customer.email,
          customer.firstName,
          customer.lastName,
          expiresAt,
        ]
      );

      insertedCustomers.push(this.mapFundraiserCustomer(result.rows[0]));
    }

    // Update booklet total sold
    await pool.query(
      'UPDATE fundraiser_booklets SET total_sold = total_sold + $1 WHERE id = $2',
      [customers.length, bookletId]
    );

    return insertedCustomers;
  }

  async getFundraiserBooklets(fundraiserId: string): Promise<FundraiserBooklet[]> {
    const result = await pool.query(
      'SELECT * FROM fundraiser_booklets WHERE fundraiser_id = $1 ORDER BY created_at DESC',
      [fundraiserId]
    );

    return result.rows.map((row) => this.mapBooklet(row));
  }

  async getBookletCustomers(bookletId: string): Promise<FundraiserCustomer[]> {
    const result = await pool.query(
      'SELECT * FROM fundraiser_customers WHERE booklet_id = $1 ORDER BY created_at DESC',
      [bookletId]
    );

    return result.rows.map((row) => this.mapFundraiserCustomer(row));
  }

  async activateFundraiser(userId: string): Promise<void> {
    await pool.query(
      `UPDATE fundraisers SET activated_at = NOW() WHERE user_id = $1`,
      [userId]
    );

    await pool.query(
      `UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2`,
      [UserStatus.ACTIVE, userId]
    );
  }

  private mapFundraiser(row: any): Fundraiser {
    return {
      id: row.id,
      userId: row.user_id,
      organizationName: row.organization_name,
      contactName: row.contact_name,
      contactEmail: row.contact_email,
      contactPhone: row.contact_phone,
      activatedAt: row.activated_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapBooklet(row: any): FundraiserBooklet {
    return {
      id: row.id,
      fundraiserId: row.fundraiser_id,
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      couponIds: row.coupon_ids || [],
      validFrom: row.valid_from,
      validUntil: row.valid_until,
      totalSold: row.total_sold || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  private mapFundraiserCustomer(row: any): FundraiserCustomer {
    return {
      id: row.id,
      fundraiserId: row.fundraiser_id,
      bookletId: row.booklet_id,
      customerId: row.customer_id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      activatedAt: row.activated_at,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

