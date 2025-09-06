"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresEnvs = void 0;
require("dotenv/config");
exports.postgresEnvs = {
    url: process.env.DB_URL,
    urlTest: process.env.DB_TEST_URL,
};
