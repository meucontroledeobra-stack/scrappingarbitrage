"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
class Result {
    _code;
    _message;
    _success;
    _data;
    constructor() { }
    addData(data) {
        this._data = data;
    }
    addError(code, message) {
        this._code = code;
        this._message = message;
    }
    toJSON() {
        return {
            message: this._message,
            code: this._code,
            success: this._success,
            data: this._data,
        };
    }
    static error(code, message) {
        const resultado = new Result();
        resultado.addError(code, message);
        return resultado.toJSON();
    }
    static success(code, message, data) {
        const result = new Result();
        result.addData(data);
        result._code = code;
        result._message = message;
        result._success = true;
        return result.toJSON();
    }
}
exports.Result = Result;
