"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orderbook = void 0;
const Base_1 = require("./Base");
class Orderbook extends Base_1.Base {
    _preco;
    _taxa;
    _horario;
    _corretora;
    _moeda;
    _bids;
    _asks;
    constructor(_id, _preco, _taxa, _horario, _corretora, _moeda, _bids, _asks) {
        super(_id);
        this._preco = _preco;
        this._taxa = _taxa;
        this._horario = _horario;
        this._corretora = _corretora;
        this._moeda = _moeda;
        this._bids = _bids;
        this._asks = _asks;
    }
    toJSON() {
        return {
            id: this._id,
            preco: this._preco,
            taxa: this._taxa,
            horario: this._horario,
            corretora: this._corretora,
            moeda: this._moeda,
            bids: this._bids,
            asks: this._asks,
        };
    }
}
exports.Orderbook = Orderbook;
