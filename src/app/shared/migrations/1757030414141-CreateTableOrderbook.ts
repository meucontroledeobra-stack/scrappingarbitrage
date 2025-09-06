import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTableOrderbook20250706123000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("orderbook");
  }
}
