"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const verification_service_1 = require("../services/verification.service");
const cookies_1 = require("../lib/cookies");
const error_middleware_1 = require("../middleware/error.middleware");
const rutValidator_1 = require("../utils/rutValidator");
const logger_1 = require("../utils/logger");
const constants_1 = require("../config/constants"); // <-- Agregado
class AuthController {
    async register(req, res, next) {
        try {
            logger_1.logger.info('Iniciando registro de usuario');
            const { firstName, lastName, email, rut, phone, password } = req.body;
            // Validate all input at once
            const validationErrors = this.validateRegistrationInput({ firstName, lastName, email, rut, phone, password });
            if (validationErrors.length > 0) {
                logger_1.logger.error(`Validación fallida: ${validationErrors.join(', ')}`);
                throw new error_middleware_1.ApiError(validationErrors.join('; '), 400);
            }
            // Format RUT before registration
            const formattedRut = this.formatRut(rut);
            // Register user with validated and formatted data
            const result = await auth_service_1.authService.register({
                firstName,
                lastName,
                email,
                rut: formattedRut,
                phone,
                password
            });
            logger_1.logger.info(`Usuario registrado correctamente: ${email}`);
            res.status(201).json({
                success: true,
                data: {
                    user: result.user,
                    token: result.token,
                    requiresVerification: true
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    validateRegistrationInput(input) {
        const errors = [];
        const { firstName, lastName, email, rut, phone, password } = input;
        // Check required fields
        ['firstName', 'lastName', 'email', 'rut', 'phone', 'password'].forEach(field => {
            if (!input[field])
                errors.push(`Campo '${field}' es requerido`);
        });
        // Only proceed with format validations if required fields are present
        if (email && !this.isValidEmail(email)) {
            errors.push('Formato de email inválido');
        }
        if (rut && !this.validateRut(rut)) {
            errors.push('RUT inválido');
        }
        if (password && password.length < 8) {
            errors.push('La contraseña debe tener al menos 8 caracteres');
        }
        return errors;
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    validateRut(rut) {
        // Assuming RutValidator is imported elsewhere
        return rutValidator_1.RutValidator.validate(rut);
    }
    formatRut(rut) {
        // Assuming RutValidator is imported elsewhere
        return rutValidator_1.RutValidator.format(rut);
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { user, token, refreshToken } = await auth_service_1.authService.login(email, password);
            cookies_1.CookieManager.setAuthCookies(res, { token, refreshToken });
            res.json({ success: true, data: { user } });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyEmail(req, res, next) {
        try {
            const { email, code } = req.body;
            const isValid = await verification_service_1.VerificationService.verifyCode(email, code);
            if (!isValid) {
                throw new error_middleware_1.ApiError(400, 'Código de verificación inválido');
            }
            await auth_service_1.authService.markEmailAsVerified(email);
            res.json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }
    async refreshToken(req, res, next) {
        try {
            const refreshToken = req.cookies[constants_1.constants.COOKIE.REFRESH]; // Ahora se reconoce
            const { token, newRefreshToken } = await auth_service_1.authService.refreshToken(refreshToken);
            cookies_1.CookieManager.setAuthCookies(res, {
                token,
                refreshToken: newRefreshToken
            });
            res.json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res) {
        cookies_1.CookieManager.clearAuthCookies(res);
        res.json({ success: true });
    }
}
exports.AuthController = AuthController;
