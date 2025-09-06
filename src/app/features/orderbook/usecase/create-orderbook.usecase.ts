import { CacheRepository } from "../../../shared/cache/cache.repository";
import { Result, ResultDto } from "../../../shared/utils";
import { OrderbookRepository } from "../repository";

const CACHE_PREFIX = "cache-orderbook";

export class CreateOrderbookUsecase {
  async execute(data: {
    preco: string;
    taxa: string;
    horario: string;
    corretora: string;
    moeda: string;
    bids: { preco: string; quantidade: string; acumulado: string }[];
    asks: { preco: string; quantidade: string; acumulado: string }[];
  }): Promise<ResultDto> {
    const orderbookRepository = new OrderbookRepository();
    const cacheRepository = new CacheRepository();

    const newOrderbook = await orderbookRepository.createOrderbook(data);

    await cacheRepository.delete(CACHE_PREFIX);
    const orderbooksFromDB = await orderbookRepository.listOrderbooks();
    const updatedCache = orderbooksFromDB.map((o) => o.toJSON());
    await cacheRepository.set(CACHE_PREFIX, updatedCache);

    return Result.success(
      200,
      "Orderbook cadastrado com sucesso.",
      newOrderbook.toJSON()
    );
  }
}
