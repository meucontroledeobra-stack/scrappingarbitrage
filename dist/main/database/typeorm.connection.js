"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnection = void 0;
const typeorm_config_1 = __importDefault(require("../config/typeorm.config"));
class DatabaseConnection {
    static _connection;
    static get connection() {
        if (!this._connection) {
            throw new Error("Não existe conexão com o banco estabelecida");
        }
        return this._connection;
    }
    static async connect() {
        if (!this._connection?.isInitialized) {
            this._connection = await typeorm_config_1.default.initialize();
        }
        console.log("Conexão com o database foi inicializada");
    }
    static async destroy() {
        if (!this._connection) {
            throw new Error("A base de dados não está inicializada.");
        }
        await this._connection.destroy();
        console.log("Conexão com a base de dados SQL destruida");
    }
}
exports.DatabaseConnection = DatabaseConnection;
