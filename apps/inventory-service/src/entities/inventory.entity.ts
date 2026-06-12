import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  stock: number;
}
