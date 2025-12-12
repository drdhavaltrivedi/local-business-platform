import { pool } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { UserRole, UserStatus, User, LoginRequest, RegisterRequest } from '../../../shared/types';

export class UserService {
  async createUser(data: RegisterRequest): Promise<User> {
    const passwordHash = await hashPassword(data.password);
    const roles = [UserRole.USER, data.role];
    const status = UserStatus.PENDING;

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, roles, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        data.email,
        passwordHash,
        data.firstName,
        data.lastName,
        data.phone || null,
        JSON.stringify(roles),
        status,
      ]
    );

    return this.mapUser(result.rows[0]);
  }

  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [credentials.email]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = this.mapUser(result.rows[0]);
    const isValid = await comparePassword(credentials.password, user.passwordHash);

    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new Error('Account is not active');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      roles: user.roles,
    });

    return { user, token };
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return this.mapUser(result.rows[0]);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return null;
    return this.mapUser(result.rows[0]);
  }

  async activateUser(userId: string): Promise<void> {
    await pool.query(
      'UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2',
      [UserStatus.ACTIVE, userId]
    );
  }

  private mapUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      firstName: row.first_name,
      lastName: row.last_name,
      phone: row.phone,
      roles: JSON.parse(row.roles || '[]'),
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

