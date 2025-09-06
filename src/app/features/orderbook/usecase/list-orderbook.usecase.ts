import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Result, ResultDto } from "../../../shared/utils";
import { OrderbookRepository } from "../repository";

const CACHE_PREFIX = "cache-orderbook";

export class ListOrderbooksUsecase {
  async execute(): Promise<ResultDto> {
    const orderbookRepository = new OrderbookRepository();
    const cacheRepository = new CacheRepository();

    const orderbooksFromDB = await orderbookRepository.listOrderbooks();
    const orderbooks = orderbooksFromDB.map((o) => o.toJSON());

    await cacheRepository.set(CACHE_PREFIX, orderbooks);

    return Result.success(200, "Orderbooks listados.", orderbooks);
  }
}
