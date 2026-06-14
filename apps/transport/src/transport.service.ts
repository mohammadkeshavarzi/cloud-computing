import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transport } from './entities/transport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransportService {
  constructor(
    @InjectRepository(Transport)
    private readonly transportRepo: Repository<Transport>,
  ) {}

  async handleOrderCreated(data: {
    orderId: number;
    productId: number;
    quantity: number;
  }) {
    const transportRecord = this.transportRepo.create({
      orderId: data.orderId,
      status: 'PENDING',
    });

    await this.transportRepo.save(transportRecord);

    console.log(`[Transport Service] Transport record created successfully.`);
  }
}
