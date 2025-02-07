import { Cache } from '../lib/cache';
import { EmailService } from '../services/email.service';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/error.middleware';

export class VerificationService {
  private static codeCache = new Cache<string>('verification', 15 * 60); // 15 minutes

  private static generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendVerificationCode(email: string): Promise<void> {
    try {
      const code = this.generateCode();
      await this.codeCache.set(email, code);
      await EmailService.sendVerificationEmail(email, code);
    } catch (error) {
      logger.error('Error in verification service:', error);
      throw new ApiError(500, 'Error al enviar código de verificación');
    }
  }

  static async verifyCode(email: string, code: string): Promise<boolean> {
    const storedCode = await this.codeCache.get(email);
    if (!storedCode) return false;
    
    const isValid = storedCode === code;
    if (isValid) {
      await this.codeCache.delete(email);
    }
    
    return isValid;
  }
}
