"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrderbookUsecase = void 0;
const cache_repository_1 = require("../../../shared/cache/cache.repository");
const utils_1 = require("../../../shared/utils");
const repository_1 = require("../repository");
const CACHE_PREFIX = "cache-orderbook";
class CreateOrderbookUsecase {
    async execute(data) {
        const orderbookRepository = new repository_1.OrderbookRepository();
        const cacheRepository = new cache_repository_1.CacheRepository();
        const newOrderbook = await orderbookRepository.createOrderbook(data);
        await cacheRepository.delete(CACHE_PREFIX);
        const orderbooksFromDB = await orderbookRepository.listOrderbooks();
        const updatedCache = orderbooksFromDB.map((o) => o.toJSON());
        await cacheRepository.set(CACHE_PREFIX, updatedCache);
        return utils_1.Result.success(200, "Orderbook cadastrado com sucesso.", newOrderbook.toJSON());
    }
}
exports.CreateOrderbookUsecase = CreateOrderbookUsecase;
