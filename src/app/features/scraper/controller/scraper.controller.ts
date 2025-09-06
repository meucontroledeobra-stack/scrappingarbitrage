import { Request, Response } from "express";
import { ScraperUsecase } from "../usecase";

export class ScraperController {
  static async scraper(req: Request, res: Response) {
    const usecase = new ScraperUsecase();

    const result = await usecase.execute();

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    return res.json(result.data);
  }
}
