import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { VerificationService } from '../services/verification.service';
import { CookieManager } from '../lib/cookies';
import { ApiError } from '../middleware/error.middleware';
import { constants } from '../config/constants'; // <-- Agregado

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      await VerificationService.sendVerificationCode(user.email);
      res.status(201).json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, token, refreshToken } = await authService.login(email, password);
      
      CookieManager.setAuthCookies(res, { token, refreshToken });
      
      res.json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, code } = req.body;
      const isValid = await VerificationService.verifyCode(email, code);
      
      if (!isValid) {
        throw new ApiError(400, 'Código de verificación inválido');
      }
      
      await authService.markEmailAsVerified(email);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies[constants.COOKIE.REFRESH]; // Ahora se reconoce
      const { token, newRefreshToken } = await authService.refreshToken(refreshToken);
      
      CookieManager.setAuthCookies(res, { 
        token, 
        refreshToken: newRefreshToken 
      });
      
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response) {
    CookieManager.clearAuthCookies(res);
    res.json({ success: true });
  }
}