import { userModel } from '../models/user.model';
import { User, UserResponse, AuthTokens } from '../types/auth.types';
import { ApiError } from '../middleware/error.middleware';
import { JWT } from '../lib/jwt';
import bcrypt from 'bcryptjs';

export class AuthService {
  private userModel: any;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.userModel = await userModel;
  }

  async register(userData: { 
    firstName: string;
    lastName: string;
    email: string;
    rut: string;
    phone: string;
    password: string;
  }): Promise<{ user: UserResponse; token: string; refreshToken: string }> {
    if (!this.userModel) {
      await this.initialize();
    }
    
    // Verificar usuario existente
    const existingUser = await this.userModel.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(400, 'El email ya está registrado');
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
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
    const token = JWT.signToken(userResponse);
    const refreshToken = JWT.signToken(userResponse);
    
    return {
      user: userResponse,
      token,
      refreshToken
    };
  }

  async login(email: string, password: string): Promise<{ user: UserResponse; token: string; refreshToken: string }> {
    if (!this.userModel) {
      await this.initialize();
    }

    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ApiError(400, 'Credenciales inválidas');
    }

    const { password: _, ...userResponse } = user;
    const token = JWT.signToken(userResponse);
    const refreshToken = JWT.signToken(userResponse);
    return { user: userResponse, token, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; newRefreshToken: string }> {
    try {
      const userResponse = JWT.verifyToken(refreshToken);
      const token = JWT.signToken(userResponse);
      const newRefreshToken = JWT.signToken(userResponse);
      return { token, newRefreshToken };
    } catch (error) {
      throw new ApiError(401, 'Refresh token inválido');
    }
  }

  async markEmailAsVerified(email: string): Promise<void> {
    if (!this.userModel) {
      await this.initialize();
    }

    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new ApiError(404, 'Usuario no encontrado');
    }
    await this.userModel.updateById(user._id!, { isEmailVerified: true });
  }
}

export const authService = new AuthService();