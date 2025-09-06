"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpHelper = void 0;
class HttpHelper {
    success(response, result) {
        return response.status(result.code ?? 200).send(result);
    }
    serverError(response, result) {
        return response.status(result.code ?? 500).send(result);
    }
    badRequestError(response, result) {
        return response.status(result.code ?? 400).send(result);
    }
}
exports.httpHelper = new HttpHelper();
