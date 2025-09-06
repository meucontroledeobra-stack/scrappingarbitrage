"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderbookRepository = void 0;
const typeorm_connection_1 = require("../../../../main/database/typeorm.connection");
const models_1 = require("../../../models");
const orderbook_entity_1 = require("../../../shared/entities/orderbook.entity");
class OrderbookRepository {
    _manager = typeorm_connection_1.DatabaseConnection.connection.manager;
    async createOrderbook(data) {
        const orderbookEntity = this._manager.create(orderbook_entity_1.OrderbookEntity, {
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
    async listOrderbooks() {
        const orderbooks = await this._manager.find(orderbook_entity_1.OrderbookEntity);
        return orderbooks.map((o) => this.orderbookEntityToModel(o));
    }
    orderbookEntityToModel(entity) {
        return new models_1.Orderbook(entity.id, entity.preco, entity.taxa, entity.horario, entity.corretora, entity.moeda, entity.bids, entity.asks);
    }
}
exports.OrderbookRepository = OrderbookRepository;
