"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisConnection = void 0;
const cache_config_1 = require("../config/cache.config");
class RedisConnection {
    static _connection;
    static get connection() {
        if (!this._connection) {
            throw new Error("Conexão com a base de dados de cache não estabelecida!");
        }
        return this._connection;
    }
    static async connect() {
        if (!this._connection) {
            this._connection = cache_config_1.redis;
            console.log("Base de dados de cache conectada!");
        }
    }
    static async destroy() {
        if (!this._connection) {
            throw new Error("A base de dados de cache não está inicializada.");
        }
        await this._connection.quit();
        console.log("Conexão com a base de dados NoSQL destruida");
    }
}
exports.RedisConnection = RedisConnection;
