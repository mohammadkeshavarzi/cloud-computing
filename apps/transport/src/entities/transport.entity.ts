import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Transports')
export class Transport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  status: string;
}
