import { Router } from "express";
import { OrderbookController } from "./controller";

export default () => {
  const router = Router();

  router.post("/orderbook", OrderbookController.createOrderbook);

  router.get("/orderbooks", OrderbookController.listOrderbooks);

  return router;
};
