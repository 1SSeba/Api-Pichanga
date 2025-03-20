"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSRFProtection = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
class CSRFProtection {
    static async generateToken(sessionId) {
        const token = crypto_1.default.randomBytes(32).toString('hex');
        await redis_1.redis.setex(`${this.PREFIX}${sessionId}`, this.TTL, token);
        return token;
    }
    static async validateToken(sessionId, token) {
        try {
            const storedToken = await redis_1.redis.get(`${this.PREFIX}${sessionId}`);
            return storedToken === token;
        }
        catch (error) {
            logger_1.logger.error('CSRF validation error:', error);
            return false;
        }
    }
}
exports.CSRFProtection = CSRFProtection;
CSRFProtection.PREFIX = 'csrf:';
CSRFProtection.TTL = 24 * 60 * 60; // 24 hours in seconds
