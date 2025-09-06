import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { Orderbook } from "../../../models";
import { OrderbookEntity } from "../../../shared/entities/orderbook.entity";

export class OrderbookRepository {
  private _manager = DatabaseConnection.connection.manager;

  async createOrderbook(data: {
    preco: string;
    taxa: string;
    horario: string;
    corretora: string;
    moeda: string;
    bids: { preco: string; quantidade: string; acumulado: string }[];
    asks: { preco: string; quantidade: string; acumulado: string }[];
  }): Promise<Orderbook> {
    const orderbookEntity = this._manager.create(OrderbookEntity, {
      preco: data.preco,
      taxa: data.taxa,
      horario: data.horario,
      corretora: data.corretora,
      moeda: data.moeda,
      bids: data.bids,
      asks: data.asks,
    });

    const savedOrderbook = await this._manager.save(orderbookEntity);

    return this.orderbookEntityToModel(savedOrderbook);
  }

  async listOrderbooks(): Promise<Orderbook[]> {
    const orderbooks = await this._manager.find(OrderbookEntity);
    return orderbooks.map((o) => this.orderbookEntityToModel(o));
  }

  private orderbookEntityToModel(entity: OrderbookEntity): Orderbook {
    return new Orderbook(
      entity.id,
      entity.preco,
      entity.taxa,
      entity.horario,
      entity.corretora,
      entity.moeda,
      entity.bids,
      entity.asks
    );
  }
}
