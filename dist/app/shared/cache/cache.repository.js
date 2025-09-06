"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheRepository = void 0;
const ioredis_connection_1 = require("../../../main/database/ioredis.connection");
class CacheRepository {
    _redis = ioredis_connection_1.RedisConnection.connection;
    async get(key) {
        const data = await this._redis.get(key);
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    }
    async set(key, data) {
        const dataStr = JSON.stringify(data);
        return this._redis.set(key, dataStr);
    }
    async delete(key) {
        return this._redis.del(key);
    }
}
exports.CacheRepository = CacheRepository;
