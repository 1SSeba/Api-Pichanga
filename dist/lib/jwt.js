"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
class JWT {
    static signToken(payload) {
        const jwtPayload = {
            _id: payload._id?.toString() || '',
            email: payload.email,
            role: payload.role,
            firstName: payload.firstName,
            lastName: payload.lastName,
            rut: payload.rut,
            phone: payload.phone,
            isEmailVerified: payload.isEmailVerified
        };
        const options = {
            expiresIn: process.env.JWT_EXPIRY || '24h'
        };
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET must be defined');
        }
        return jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_SECRET, options);
    }
    static verifyToken(token) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET must be defined');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Convert back to UserResponse format with correct types
            const userResponse = {
                _id: new mongodb_1.ObjectId(decoded._id),
                email: decoded.email,
                role: decoded.role,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                rut: decoded.rut,
                phone: decoded.phone,
                isEmailVerified: decoded.isEmailVerified,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            return userResponse;
        }
        catch (error) {
            throw new Error('Invalid token');
        }
    }
}
exports.JWT = JWT;
