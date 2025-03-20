"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const logger_1 = require("../utils/logger");
const error_middleware_1 = require("../middleware/error.middleware");
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
class EmailService {
    static async sendVerificationEmail(email, code) {
        try {
            await mail_1.default.send({
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
        }
        catch (error) {
            logger_1.logger.error('Error sending verification email:', error);
            throw new error_middleware_1.ApiError(500, 'Error al enviar email de verificación');
        }
    }
}
exports.EmailService = EmailService;
