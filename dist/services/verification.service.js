"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationService = void 0;
const cache_1 = require("../lib/cache");
const email_service_1 = require("../services/email.service");
const logger_1 = require("../utils/logger");
const error_middleware_1 = require("../middleware/error.middleware");
class VerificationService {
    static generateCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    static async sendVerificationCode(email) {
        try {
            const code = this.generateCode();
            await this.codeCache.set(email, code);
            await email_service_1.EmailService.sendVerificationEmail(email, code);
        }
        catch (error) {
            logger_1.logger.error('Error in verification service:', error);
            throw new error_middleware_1.ApiError(500, 'Error al enviar código de verificación');
        }
    }
    static async verifyCode(email, code) {
        const storedCode = await this.codeCache.get(email);
        if (!storedCode)
            return false;
        const isValid = storedCode === code;
        if (isValid) {
            await this.codeCache.delete(email);
        }
        return isValid;
    }
}
exports.VerificationService = VerificationService;
VerificationService.codeCache = new cache_1.Cache('verification', 15 * 60); // 15 minutes
