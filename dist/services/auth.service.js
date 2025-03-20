"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const user_model_1 = require("../models/user.model");
const error_middleware_1 = require("../middleware/error.middleware");
const jwt_1 = require("../lib/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class AuthService {
    constructor() {
        this.initialize();
    }
    async initialize() {
        this.userModel = await user_model_1.userModel;
    }
    async register(userData) {
        if (!this.userModel) {
            await this.initialize();
        }
        // Verificar usuario existente
        const existingUser = await this.userModel.findByEmail(userData.email);
        if (existingUser) {
            throw new error_middleware_1.ApiError(400, 'El email ya está registrado');
        }
        // Hash de la contraseña
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        // Crear usuario
        const user = await this.userModel.create({
            ...userData,
            password: hashedPassword,
            isEmailVerified: false,
            role: 'user',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Eliminar la contraseña del objeto a retornar
        const { password: _, ...userResponse } = user;
        // Generar tokens
        const token = jwt_1.JWT.signToken(userResponse);
        const refreshToken = jwt_1.JWT.signToken(userResponse);
        return {
            user: userResponse,
            token,
            refreshToken
        };
    }
    async login(email, password) {
        if (!this.userModel) {
            await this.initialize();
        }
        const user = await this.userModel.findByEmail(email);
        if (!user) {
            throw new error_middleware_1.ApiError(404, 'Usuario no encontrado');
        }
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw new error_middleware_1.ApiError(400, 'Credenciales inválidas');
        }
        const { password: _, ...userResponse } = user;
        const token = jwt_1.JWT.signToken(userResponse);
        const refreshToken = jwt_1.JWT.signToken(userResponse);
        return { user: userResponse, token, refreshToken };
    }
    async refreshToken(refreshToken) {
        try {
            const userResponse = jwt_1.JWT.verifyToken(refreshToken);
            const token = jwt_1.JWT.signToken(userResponse);
            const newRefreshToken = jwt_1.JWT.signToken(userResponse);
            return { token, newRefreshToken };
        }
        catch (error) {
            throw new error_middleware_1.ApiError(401, 'Refresh token inválido');
        }
    }
    async markEmailAsVerified(email) {
        if (!this.userModel) {
            await this.initialize();
        }
        const user = await this.userModel.findByEmail(email);
        if (!user) {
            throw new error_middleware_1.ApiError(404, 'Usuario no encontrado');
        }
        await this.userModel.updateById(user._id, { isEmailVerified: true });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
