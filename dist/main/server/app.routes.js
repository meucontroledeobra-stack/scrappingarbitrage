"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRoutes = void 0;
const orderbook_routes_1 = __importDefault(require("../../app/features/orderbook/orderbook.routes"));
const scraper_routes_1 = __importDefault(require("../../app/features/scraper/scraper.routes"));
const makeRoutes = (app) => {
    app.use((0, orderbook_routes_1.default)(), (0, scraper_routes_1.default)());
};
exports.makeRoutes = makeRoutes;
