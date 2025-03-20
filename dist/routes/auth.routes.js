"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const rate_limit_middleware_1 = require("../middleware/rate-limit.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_validation_1 = require("../validations/auth.validation");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/register', async (req, res, next) => {
    try {
        await authController.register(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/login', rate_limit_middleware_1.rateLimitMiddleware, (0, validation_middleware_1.validate)(auth_validation_1.authValidation.login), authController.login);
router.post('/verify-email', rate_limit_middleware_1.rateLimitMiddleware, (0, validation_middleware_1.validate)(auth_validation_1.authValidation.verifyEmail), authController.verifyEmail);
router.post('/refresh-token', rate_limit_middleware_1.rateLimitMiddleware, authController.refreshToken);
router.post('/logout', auth_middleware_1.authMiddleware, authController.logout);
exports.default = router;
