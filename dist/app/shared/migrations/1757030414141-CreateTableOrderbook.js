"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTableOrderbook20250706123000 = void 0;
const typeorm_1 = require("typeorm");
class CreateTableOrderbook20250706123000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "orderbook",
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "uuid",
                },
                {
                    name: "preco",
                    type: "varchar",
                    length: "50",
                    isNullable: false,
                },
                {
                    name: "taxa",
                    type: "varchar",
                    length: "50",
                    isNullable: true,
                },
                {
                    name: "horario",
                    type: "varchar",
                    length: "20",
                    isNullable: true,
                },
                {
                    name: "corretora",
                    type: "varchar",
                    length: "50",
                    isNullable: false,
                },
                {
                    name: "moeda",
                    type: "varchar",
                    length: "50",
                    isNullable: false,
                },
                {
                    name: "bids",
                    type: "json",
                    isNullable: false,
                },
                {
                    name: "asks",
                    type: "json",
                    isNullable: false,
                },
            ],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("orderbook");
    }
}
exports.CreateTableOrderbook20250706123000 = CreateTableOrderbook20250706123000;
