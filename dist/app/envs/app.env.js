"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appEnvs = void 0;
require("dotenv/config");
exports.appEnvs = {
    redisUrl: process.env.REDIS_URL,
    porta: process.env.PORT,
    dbURL: process.env.DB_URL,
    ambiente: process.env.NODE_ENV,
};
