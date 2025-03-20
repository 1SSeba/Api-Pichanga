"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfMiddleware = void 0;
const csrf_1 = require("../lib/csrf");
const csrfMiddleware = async (req, res, next) => {
    const sessionId = req.cookies && req.cookies['session_id'];
    const token = req.headers['x-csrf-token'];
    if (!sessionId || !token) {
        return res.status(403).json({ success: false, error: 'CSRF token missing' });
    }
    const valid = await csrf_1.CSRFProtection.validateToken(sessionId, token);
    if (!valid) {
        return res.status(403).json({ success: false, error: 'CSRF token invalid' });
    }
    next();
};
exports.csrfMiddleware = csrfMiddleware;
