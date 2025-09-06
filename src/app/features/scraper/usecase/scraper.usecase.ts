import { ScrapeRepository } from "../repository";

export class ScraperUsecase {
  private scraperRepo = new ScrapeRepository();

  async execute() {
    try {
      const orderbooks = await this.scraperRepo.scrapeFundingRates();
      return { success: true, data: orderbooks };
    } catch (error: any) {
      return { success: false, error: error.message || "Erro no scraping" };
    }
  }
}
