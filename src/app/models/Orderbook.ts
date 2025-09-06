import { Base } from "./Base";

export interface OrderbookJSON {
  id: string;
  preco: string;
  taxa: string;
  horario: string;
  corretora: string;
  moeda: string;
  bids: Array<{ preco: string; quantidade: string; acumulado: string }>;
  asks: Array<{ preco: string; quantidade: string; acumulado: string }>;
}

export class Orderbook extends Base {
  constructor(
    _id: string,
    private _preco: string,
    private _taxa: string,
    private _horario: string,
    private _corretora: string,
    private _moeda: string,
    private _bids: Array<{
      preco: string;
      quantidade: string;
      acumulado: string;
    }>,
    private _asks: Array<{
      preco: string;
      quantidade: string;
      acumulado: string;
    }>
  ) {
    super(_id);
  }

  toJSON(): OrderbookJSON {
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
