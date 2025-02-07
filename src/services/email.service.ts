import sgMail from '@sendgrid/mail';
import { logger } from '../utils/logger';
import { ApiError } from '../middleware/error.middleware';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export class EmailService {
  static async sendVerificationEmail(email: string, code: string): Promise<void> {
    try {
      await sgMail.send({
        to: email,
        from: 'noreply@pichanga.com',
        subject: 'Verifica tu correo electrónico',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verifica tu correo electrónico</h2>
            <p>Tu código de verificación es:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
              ${code}
            </h1>
            <p>Este código expirará en 15 minutos.</p>
          </div>
        `
      });
    } catch (error) {
      logger.error('Error sending verification email:', error);
      throw new ApiError(500, 'Error al enviar email de verificación');
    }
  }
}