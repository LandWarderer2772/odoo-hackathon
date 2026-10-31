import argon2 from 'argon2';
import crypto from 'node:crypto';
import { BadRequestError } from './errors.js';

export function validatePasswordStrength(password: string): void {
  if (!password || password.length <= 8) {
    throw new BadRequestError('Password must be longer than 8 characters (at least 9 characters)');
  }

  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    throw new BadRequestError('Password must contain at least one uppercase letter');
  }

  const hasLowercase = /[a-z]/.test(password);
  if (!hasLowercase) {
    throw new BadRequestError('Password must contain at least one lowercase letter');
  }

  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  if (!hasSpecialChar) {
    throw new BadRequestError('Password must contain at least one special character');
  }
}

export async function hashPassword(password: string): Promise<string> {
  validatePasswordStrength(password);
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16, // 64 MB
    timeCost: 3,
    parallelism: 1,
  });
}

export async function verifyPassword(hash: string, plainText: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plainText);
  } catch {
    return false;
  }
}

export function generateResetToken(): { token: string; hashedToken: string; expiresAt: Date } {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  // Token expires in 1 hour
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  return { token, hashedToken, expiresAt };
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
