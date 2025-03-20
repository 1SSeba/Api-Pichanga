"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = void 0;
const rate_limit_1 = require("../lib/rate-limit");
const constants_1 = require("../config/constants");
const limiter = new rate_limit_1.RateLimiter({
    windowMs: constants_1.constants.RATE_LIMIT.WINDOW_MS,
    maxRequests: constants_1.constants.RATE_LIMIT.MAX_REQUESTS
});
const rateLimitMiddleware = async (req, res, next) => {
    try {
        await limiter.limit(req);
        next();
    }
    catch (error) {
        if (error instanceof Response) {
            res.status(429).json({
                error: 'Demasiadas solicitudes',
                retryAfter: error.headers.get('Retry-After')
            });
        }
        else {
            next(error);
        }
    }
};
exports.rateLimitMiddleware = rateLimitMiddleware;
