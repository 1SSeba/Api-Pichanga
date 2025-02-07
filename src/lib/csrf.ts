import crypto from 'crypto';
import { redis } from '../config/redis';
import { logger } from '../utils/logger';

export class CSRFProtection {
  private static readonly PREFIX = 'csrf:';
  private static readonly TTL = 24 * 60 * 60; // 24 hours in seconds

  static async generateToken(sessionId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    await redis.setex(`${this.PREFIX}${sessionId}`, this.TTL, token);
    return token;
  }

  static async validateToken(sessionId: string, token: string): Promise<boolean> {
    try {
      const storedToken = await redis.get(`${this.PREFIX}${sessionId}`);
      return storedToken === token;
    } catch (error) {
      logger.error('CSRF validation error:', error);
      return false;
    }
  }
}
