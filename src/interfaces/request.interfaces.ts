import { Request } from 'express';
import { User } from '../types/auth.types';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
    role: string;
  };
}