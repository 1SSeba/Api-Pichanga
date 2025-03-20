"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(options) {
        this.options = options;
        this.requests = new Map();
    }
    async limit(req) {
        const key = req.ip || req.connection.remoteAddress || 'unknown';
        const now = Date.now();
        const record = this.requests.get(key);
        if (!record) {
            this.requests.set(key, { count: 1, firstRequest: now });
            return;
        }
        if (now - record.firstRequest < this.options.windowMs) {
            record.count++;
            if (record.count > this.options.maxRequests) {
                const retryAfter = Math.ceil((this.options.windowMs - (now - record.firstRequest)) / 1000);
                const errorResponse = new Response(null, { headers: { 'Retry-After': String(retryAfter) } });
                throw errorResponse;
            }
        }
        else {
            this.requests.set(key, { count: 1, firstRequest: now });
        }
    }
}
exports.RateLimiter = RateLimiter;
