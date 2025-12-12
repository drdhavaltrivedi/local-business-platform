import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';
import { UserRole } from '../../../shared/types';

export interface JWTPayload {
  userId: string;
  email: string;
  roles: UserRole[];
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, config.jwtSecret) as JWTPayload;
}

