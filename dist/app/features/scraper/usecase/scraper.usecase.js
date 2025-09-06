"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperUsecase = void 0;
const repository_1 = require("../repository");

class ScraperUsecase {
  scraperRepo = new repository_1.ScrapeRepository();

  async execute(onData) {
    try {
      await this.scraperRepo.scrapeFundingRates(onData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Erro no scraping" };
    }
  }
}

exports.ScraperUsecase = ScraperUsecase;
