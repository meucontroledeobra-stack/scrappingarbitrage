"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const typeorm_1 = require("typeorm");
const envs_1 = require("../../app/envs");
const postgres_env_1 = require("../../app/envs/postgres.env");
const isProduction = envs_1.appEnvs.ambiente === "production";
const isTest = envs_1.appEnvs.ambiente?.toLocaleLowerCase() === "test";
const rootDir = isProduction ? "dist" : "src";
exports.default = new typeorm_1.DataSource({
    type: "postgres",
    url: isTest ? postgres_env_1.postgresEnvs.urlTest : postgres_env_1.postgresEnvs.url,
    entities: [rootDir + "/app/shared/entities/**/*"],
    migrations: [rootDir + "/app/shared/migrations/**/*"],
    synchronize: false,
    logging: false,
    ssl: {
        rejectUnauthorized: false,
    },
});
