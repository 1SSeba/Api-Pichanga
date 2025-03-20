import { ObjectId } from 'mongodb';
import { userModel } from '../models/user.model';
import { User, UserResponse } from '../types/auth.types';
import { ApiError } from '../middleware/error.middleware';
import { RutValidator } from '../utils/rutValidator';
import { Cache } from '../lib/cache';

export class UserService {
  private userCache = new Cache<UserResponse>('user', 30 * 60); // 30 minutes

  async findUserByRut(rut: string) {
    try {
      // Normaliza el RUT para búsqueda consistente
      const normalizedRut = RutValidator.normalize(rut);
      if (!normalizedRut) {
        throw new Error('RUT inválido');
      }
      
      // Buscar usuario por RUT normalizado
      const user = await userModel.findOne({ rut: normalizedRut });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserResponse> {
    try {
      // Check cache first
      const cached = await this.userCache.get(id);
      if (cached) return cached;

      const user = await (await userModel).findById(new ObjectId(id));
      if (!user) {
        throw new ApiError(404, 'Usuario no encontrado');
      }

      const { password, ...userResponse } = user;
      await this.userCache.set(id, userResponse);

      return userResponse;
    } catch (error) {
      throw new ApiError(500, 'Error al obtener usuario');
    }
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<UserResponse> {
    try {
      const success = await (await userModel).updateById(
        new ObjectId(id),
        updateData
      );

      if (!success) {
        throw new ApiError(404, 'Usuario no encontrado');
      }

      // Invalidate cache
      await this.userCache.delete(id);

      return this.getUserById(id);
    } catch (error) {
      throw new ApiError(500, 'Error al actualizar usuario');
    }
  }
}

export const userService = new UserService();
