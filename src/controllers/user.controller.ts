import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { AuthRequest } from '../interfaces/request.interfaces';

export class UserController {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id;
      const user = await userService.getUserById(userId);
      res.json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!._id;
      const updatedUser = await userService.updateUser(userId, req.body);
      res.json({ success: true, data: { user: updatedUser } });
    } catch (error) {
      next(error);
    }
  }
}