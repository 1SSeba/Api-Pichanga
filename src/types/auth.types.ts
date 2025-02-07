import { ObjectId } from 'mongodb';

export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  rut: string;
  phone: string;
  password: string;
  isEmailVerified: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  gamesPlayed?: number;
  tournaments?: number;
  teams?: number;
  victories?: number;
  team?: string;
  position?: string;
}

export interface UserResponse extends Omit<User, 'password'> {}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}