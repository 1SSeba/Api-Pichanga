"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const mongodb_1 = require("mongodb");
const user_model_1 = require("../models/user.model");
const error_middleware_1 = require("../middleware/error.middleware");
const rutValidator_1 = require("../utils/rutValidator");
const cache_1 = require("../lib/cache");
class UserService {
    constructor() {
        this.userCache = new cache_1.Cache('user', 30 * 60); // 30 minutes
    }
    async findUserByRut(rut) {
        try {
            // Normaliza el RUT para búsqueda consistente
            const normalizedRut = rutValidator_1.RutValidator.normalize(rut);
            if (!normalizedRut) {
                throw new Error('RUT inválido');
            }
            // Buscar usuario por RUT normalizado
            const user = await user_model_1.userModel.findOne({ rut: normalizedRut });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    async getUserById(id) {
        try {
            // Check cache first
            const cached = await this.userCache.get(id);
            if (cached)
                return cached;
            const user = await (await user_model_1.userModel).findById(new mongodb_1.ObjectId(id));
            if (!user) {
                throw new error_middleware_1.ApiError(404, 'Usuario no encontrado');
            }
            const { password, ...userResponse } = user;
            await this.userCache.set(id, userResponse);
            return userResponse;
        }
        catch (error) {
            throw new error_middleware_1.ApiError(500, 'Error al obtener usuario');
        }
    }
    async updateUser(id, updateData) {
        try {
            const success = await (await user_model_1.userModel).updateById(new mongodb_1.ObjectId(id), updateData);
            if (!success) {
                throw new error_middleware_1.ApiError(404, 'Usuario no encontrado');
            }
            // Invalidate cache
            await this.userCache.delete(id);
            return this.getUserById(id);
        }
        catch (error) {
            throw new error_middleware_1.ApiError(500, 'Error al actualizar usuario');
        }
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
