import { pool } from '../config/database';
import { Merchant, UserStatus, CreateMerchantRequest } from '../../../shared/types';

export class MerchantService {
  async createMerchant(userId: string, data: CreateMerchantRequest): Promise<Merchant> {
    const result = await pool.query(
      `INSERT INTO merchants (
        user_id, business_name, business_type, address, city, state, zip_code,
        latitude, longitude, phone, email, website
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        userId,
        data.businessName,
        data.businessType,
        data.address,
        data.city,
        data.state,
        data.zipCode,
        data.latitude,
        data.longitude,
        data.phone,
        data.email,
        data.website || null,
      ]
    );

    return this.mapMerchant(result.rows[0]);
  }

  async getMerchantByUserId(userId: string): Promise<Merchant | null> {
    const result = await pool.query(
      'SELECT * FROM merchants WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) return null;
    return this.mapMerchant(result.rows[0]);
  }

  async signAgreement(merchantId: string, userId: string): Promise<Merchant> {
    const result = await pool.query(
      `UPDATE merchants 
       SET agreement_signed = TRUE, agreement_signed_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [merchantId, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Merchant not found or unauthorized');
    }

    return this.mapMerchant(result.rows[0]);
  }

  async assignSalesperson(merchantId: string, salespersonId: string): Promise<void> {
    await pool.query(
      'UPDATE merchants SET salesperson_id = $1, updated_at = NOW() WHERE id = $2',
      [salespersonId, merchantId]
    );
  }

  async assignRegionalOwner(merchantId: string, regionalOwnerId: string): Promise<void> {
    await pool.query(
      'UPDATE merchants SET regional_owner_id = $1, updated_at = NOW() WHERE id = $2',
      [regionalOwnerId, merchantId]
    );
  }

  async getAllMerchants(filters?: {
    status?: UserStatus;
    zipCode?: string;
    salespersonId?: string;
  }): Promise<Merchant[]> {
    let query = 'SELECT * FROM merchants WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.status) {
      query += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }

    if (filters?.zipCode) {
      query += ` AND zip_code = $${paramCount++}`;
      params.push(filters.zipCode);
    }

    if (filters?.salespersonId) {
      query += ` AND salesperson_id = $${paramCount++}`;
      params.push(filters.salespersonId);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    return result.rows.map((row) => this.mapMerchant(row));
  }

  private mapMerchant(row: any): Merchant {
    return {
      id: row.id,
      userId: row.user_id,
      businessName: row.business_name,
      businessType: row.business_type,
      address: row.address,
      city: row.city,
      state: row.state,
      zipCode: row.zip_code,
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      phone: row.phone,
      email: row.email,
      website: row.website,
      status: row.status,
      activatedAt: row.activated_at,
      salespersonId: row.salesperson_id,
      regionalOwnerId: row.regional_owner_id,
      agreementSigned: row.agreement_signed,
      agreementSignedAt: row.agreement_signed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

