import { Router } from "express";
import { ScraperController } from "./controller";

export default () => {
  const router = Router();

  router.get("/scraper/orderbooks", ScraperController.scraper);

  return router;
};
