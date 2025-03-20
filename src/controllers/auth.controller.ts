import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { VerificationService } from '../services/verification.service';
import { CookieManager } from '../lib/cookies';
import { ApiError } from '../middleware/error.middleware';
import { RutValidator } from '../utils/rutValidator';
import { logger } from '../utils/logger';
import { constants } from '../config/constants'; // <-- Agregado

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Iniciando registro de usuario');
      const { firstName, lastName, email, rut, phone, password } = req.body;
      
      // Validate all input at once
      const validationErrors = this.validateRegistrationInput(
        { firstName, lastName, email, rut, phone, password }
      );
      
      if (validationErrors.length > 0) {
        logger.error(`Validación fallida: ${validationErrors.join(', ')}`);
        throw new ApiError(400, validationErrors.join('; '));
      }
      // Format RUT before registration
      const formattedRut = this.formatRut(rut);
      
      // Register user with validated and formatted data
      const result = await authService.register({
        firstName,
        lastName,
        email,
        rut: formattedRut,
        phone,
        password
      });
      
      logger.info(`Usuario registrado correctamente: ${email}`);
      
      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
          requiresVerification: true
        }
      });
    } catch (error) {
      next(error);
    }
  }

  private validateRegistrationInput(input: Record<string, any>): string[] {
    const errors = [];
    const { firstName, lastName, email, rut, phone, password } = input;
    
    // Check required fields
    ['firstName', 'lastName', 'email', 'rut', 'phone', 'password'].forEach(field => {
      if (!input[field]) errors.push(`Campo '${field}' es requerido`);
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

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  private validateRut(rut: string): boolean {
    // Assuming RutValidator is imported elsewhere
    return RutValidator.validate(rut);
  }
  
  private formatRut(rut: string): string {
    // Assuming RutValidator is imported elsewhere
    return RutValidator.format(rut);
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