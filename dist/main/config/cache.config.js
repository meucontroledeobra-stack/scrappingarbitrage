"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = require("ioredis");
const app_env_1 = require("../../app/envs/app.env");
exports.redis = new ioredis_1.Redis(app_env_1.appEnvs.redisUrl);
