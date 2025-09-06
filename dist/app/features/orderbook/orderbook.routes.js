"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
exports.default = () => {
    const router = (0, express_1.Router)();
    router.post("/orderbook", controller_1.OrderbookController.createOrderbook);
    router.get("/orderbooks", controller_1.OrderbookController.listOrderbooks);
    return router;
};
