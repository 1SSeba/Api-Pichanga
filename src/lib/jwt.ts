import jwt, { SignOptions } from 'jsonwebtoken';
import { User, UserResponse, UserRole } from '../types/auth.types';
import { ObjectId } from 'mongodb';

// Define what we store in the JWT
interface JWTPayload {
  _id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  rut: string;
  phone: string;
  isEmailVerified: boolean;
}

export class JWT {
  static signToken(payload: UserResponse): string {
    const jwtPayload: JWTPayload = {
      _id: payload._id?.toString() || '',
      email: payload.email,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
      rut: payload.rut,
      phone: payload.phone,
      isEmailVerified: payload.isEmailVerified
    };

    const options: SignOptions = {
      expiresIn: process.env.JWT_EXPIRY as SignOptions['expiresIn'] || '24h'
    };

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be defined');
    }

    return jwt.sign(jwtPayload, process.env.JWT_SECRET!, options);
  }

  static verifyToken(token: string): UserResponse {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be defined');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      
      // Convert back to UserResponse format with correct types
      const userResponse: UserResponse = {
        _id: new ObjectId(decoded._id),
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
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}