import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern, Payload } from '@nestjs/microservices';
import { OrderService } from './order-service.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // دریافت دستور ساخت سفارش از طرف API Gateway
  @MessagePattern({ cmd: 'create_order' })
  async handleCreateOrder(@Payload() data: any) {
    return this.orderService.createOrder(data);
  }

  // گوش دادن به نتایج بررسی انبار
  @EventPattern('inventory_reserved')
  async handleInventoryReserved(@Payload() data: { orderId: number }) {
    await this.orderService.updateOrderStatus(data.orderId, 'CONFIRMED');
  }

  @EventPattern('inventory_failed')
  async handleInventoryFailed(@Payload() data: { orderId: number }) {
    await this.orderService.updateOrderStatus(data.orderId, 'CANCELLED');
  }
}
