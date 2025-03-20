"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const redis_1 = require("../config/redis");
const logger_1 = require("../utils/logger");
class Cache {
    constructor(prefix, ttl) {
        this.prefix = prefix;
        this.ttl = ttl;
    }
    async set(key, value) {
        try {
            const fullKey = `${this.prefix}:${key}`;
            await redis_1.redis.setex(fullKey, this.ttl / 1000, JSON.stringify(value));
        }
        catch (error) {
            logger_1.logger.error('Cache set error:', error);
        }
    }
    async get(key) {
        try {
            const fullKey = `${this.prefix}:${key}`;
            const data = await redis_1.redis.get(fullKey);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            logger_1.logger.error('Cache get error:', error);
            return null;
        }
    }
    async delete(key) {
        try {
            const fullKey = `${this.prefix}:${key}`;
            await redis_1.redis.del(fullKey);
        }
        catch (error) {
            logger_1.logger.error('Cache delete error:', error);
        }
    }
}
exports.Cache = Cache;
