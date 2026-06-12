import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory) private inventoryRepo: Repository<Inventory>,
    @Inject('REDIS_SERVICE') private redisClient: ClientProxy,
  ) {}

  async checkAndDeductInventory(payload: {
    orderId: number;
    productId: number;
    quantity: number;
  }) {
    const { orderId, productId, quantity } = payload;

    // پیدا کردن محصول در انبار
    const item = await this.inventoryRepo.findOne({ where: { productId } });

    if (item && item.stock >= quantity) {
      // کسر موجودی
      item.stock -= quantity;
      await this.inventoryRepo.save(item);

      // اعلام موفقیت تراکنش به رادیس
      this.redisClient.emit('inventory_reserved', { orderId });
      console.log(`Inventory reserved for order ${orderId}`);
    } else {
      // اعلام شکست تراکنش به دلیل کمبود موجودی
      this.redisClient.emit('inventory_failed', { orderId });
      console.log(`Inventory failed for order ${orderId}. Out of stock!`);
    }
  }
}
