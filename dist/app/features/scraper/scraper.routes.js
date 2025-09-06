"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");

exports.default = () => {
  const router = (0, express_1.Router)();

  router.get(
    "/scraper/orderbooks",
    (req, res, next) => {
      res.setTimeout(600000, () => {
        res.status(503).json({ error: "Tempo limite da requisição excedido" });
      });
      next();
    },
    controller_1.ScraperController.scraper
  );

  return router;
};
