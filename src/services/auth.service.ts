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

  async register(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user: User = {
      ...userData,
      password: hashedPassword,
      isEmailVerified: false,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!this.userModel) {
      await this.initialize();
    }

    const createdUser = await this.userModel.create(user);
    const { password, ...userResponse } = createdUser;
    return userResponse;
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