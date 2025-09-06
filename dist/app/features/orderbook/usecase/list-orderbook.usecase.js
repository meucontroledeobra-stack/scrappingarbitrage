"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListOrderbooksUsecase = void 0;
const cache_repository_1 = require("../../../shared/cache/cache.repository");
const utils_1 = require("../../../shared/utils");
const repository_1 = require("../repository");
const CACHE_PREFIX = "cache-orderbook";
class ListOrderbooksUsecase {
    async execute() {
        const orderbookRepository = new repository_1.OrderbookRepository();
        const cacheRepository = new cache_repository_1.CacheRepository();
        const orderbooksFromDB = await orderbookRepository.listOrderbooks();
        const orderbooks = orderbooksFromDB.map((o) => o.toJSON());
        await cacheRepository.set(CACHE_PREFIX, orderbooks);
        return utils_1.Result.success(200, "Orderbooks listados.", orderbooks);
    }
}
exports.ListOrderbooksUsecase = ListOrderbooksUsecase;
