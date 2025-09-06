"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_connection_1 = require("./database/ioredis.connection");
const typeorm_connection_1 = require("./database/typeorm.connection");
const express_server_1 = require("./server/express.server");
Promise.all([typeorm_connection_1.DatabaseConnection.connect(), ioredis_connection_1.RedisConnection.connect()])
    .then(express_server_1.runServer)
    .catch((err) => {
    console.log(err.toString());
});
