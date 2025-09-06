import { Request, Response } from "express";
import { httpHelper, Result } from "../../../shared/utils";
import { CreateOrderbookUsecase, ListOrderbooksUsecase } from "../usecase";

export class OrderbookController {
  static async createOrderbook(req: Request, res: Response) {
    const orderbookData = req.body;

    try {
      const usecase = new CreateOrderbookUsecase();
      const result = await usecase.execute(orderbookData);

      if (!result.success) return httpHelper.badRequestError(res, result);

      return httpHelper.success(res, result);
    } catch (error: any) {
      return httpHelper.badRequestError(
        res,
        Result.error(500, error.toString())
      );
    }
  }

  static async listOrderbooks(req: Request, res: Response) {
    try {
      const usecase = new ListOrderbooksUsecase();
      const result = await usecase.execute();

      return httpHelper.success(res, result);
    } catch (error: any) {
      return httpHelper.badRequestError(
        res,
        Result.error(500, error.message || "Erro interno no servidor.")
      );
    }
  }
}
