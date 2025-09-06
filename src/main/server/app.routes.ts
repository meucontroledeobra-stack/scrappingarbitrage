import { Express } from "express";
import orderbookRoutes from "../../app/features/orderbook/orderbook.routes";
import scraperRoutes from "../../app/features/scraper/scraper.routes";

export const makeRoutes = (app: Express) => {
  app.use(orderbookRoutes(), scraperRoutes());
};
