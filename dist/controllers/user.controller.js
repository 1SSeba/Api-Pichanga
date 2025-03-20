"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    async getProfile(req, res, next) {
        try {
            const userId = req.user._id;
            const user = await user_service_1.userService.getUserById(userId);
            res.json({ success: true, data: { user } });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const userId = req.user._id;
            const updatedUser = await user_service_1.userService.updateUser(userId, req.body);
            res.json({ success: true, data: { user: updatedUser } });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
