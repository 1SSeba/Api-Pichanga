"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("../utils/logger");
class RedisClient {
    constructor() { }
    static getInstance() {
        if (!RedisClient.instance) {
            const redisUrl = process.env.REDIS_URL;
            if (!redisUrl) {
                throw new Error('REDIS_URL is not defined');
            }
            RedisClient.instance = new ioredis_1.default(redisUrl, {
                retryStrategy: (times) => Math.min(times * 50, 2000)
            });
            RedisClient.instance.on('error', (error) => {
                logger_1.logger.error('Redis Error:', error);
            });
        }
        return RedisClient.instance;
    }
}
exports.redis = RedisClient.getInstance();
