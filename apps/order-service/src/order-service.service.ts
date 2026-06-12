import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @Inject('REDIS_SERVICE') private redisClient: ClientProxy,
  ) {}

  async createOrder(orderData: { productId: number; quantity: number }) {
    // ۱. ساخت سفارش با وضعیت اولیه PENDING
    const order = this.orderRepo.create({ ...orderData, status: 'PENDING' });
    const savedOrder = await this.orderRepo.save(order);

    // ۲. پرتاب کردن رویداد به رادیس (Fire and Forget)
    this.redisClient.emit('order_created', {
      orderId: savedOrder.id,
      productId: savedOrder.productId,
      quantity: savedOrder.quantity,
    });

    return {
      message: 'سفارش ثبت اولیه شد و در حال پردازش است',
      orderId: savedOrder.id,
    };
  }

  async updateOrderStatus(orderId: number, status: 'CONFIRMED' | 'CANCELLED') {
    await this.orderRepo.update(orderId, { status });
    console.log(`Order ${orderId} updated to ${status}`);
  }
}
