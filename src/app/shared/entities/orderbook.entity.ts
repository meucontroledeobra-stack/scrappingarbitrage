import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import { randomUUID } from "crypto";

@Entity("orderbook")
export class OrderbookEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  preco!: string;

  @Column()
  taxa!: string;

  @Column()
  horario!: string;

  @Column()
  corretora!: string;

  @Column()
  moeda!: string;

  @Column({ type: "jsonb" })
  bids!: Array<{ preco: string; quantidade: string; acumulado: string }>;

  @Column({ type: "jsonb" })
  asks!: Array<{ preco: string; quantidade: string; acumulado: string }>;

  @BeforeInsert()
  beforeInsert() {
    this.id = randomUUID();
  }
}
