"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderbookController = void 0;
const utils_1 = require("../../../shared/utils");
const usecase_1 = require("../usecase");
class OrderbookController {
    static async createOrderbook(req, res) {
        const orderbookData = req.body;
        try {
            const usecase = new usecase_1.CreateOrderbookUsecase();
            const result = await usecase.execute(orderbookData);
            if (!result.success)
                return utils_1.httpHelper.badRequestError(res, result);
            return utils_1.httpHelper.success(res, result);
        }
        catch (error) {
            return utils_1.httpHelper.badRequestError(res, utils_1.Result.error(500, error.toString()));
        }
    }
    static async listOrderbooks(req, res) {
        try {
            const usecase = new usecase_1.ListOrderbooksUsecase();
            const result = await usecase.execute();
            return utils_1.httpHelper.success(res, result);
        }
        catch (error) {
            return utils_1.httpHelper.badRequestError(res, utils_1.Result.error(500, error.message || "Erro interno no servidor."));
        }
    }
}
exports.OrderbookController = OrderbookController;
