import { Response } from 'express';
import { constants } from '../config/constants';

export class CookieManager {
  static setAuthCookies(res: Response, { token, refreshToken }: { token: string; refreshToken: string }): void {
    res.cookie(constants.COOKIE.AUTH, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 60 * 60 * 1000 // 3 hours
    });

    res.cookie(constants.COOKIE.REFRESH, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  static clearAuthCookies(res: Response): void {
    res.clearCookie(constants.COOKIE.AUTH);
    res.clearCookie(constants.COOKIE.REFRESH);
  }
}
