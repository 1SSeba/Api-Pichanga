"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = void 0;
exports.constants = {
    JWT: {
        SECRET: process.env.JWT_SECRET || 'your-secret-key',
        EXPIRY: '24h',
        REFRESH_EXPIRY: '7d'
    },
    COOKIE: {
        AUTH: 'auth_token',
        REFRESH: 'refresh_token',
        SESSION: 'session_id'
    },
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000,
        MAX_REQUESTS: 100
    },
    CACHE: {
        USER_TTL: 30 * 60 * 1000,
        STATIC_TTL: 24 * 60 * 60 * 1000
    }
};
