import { Controller, Get } from '@nestjs/common';
import { TransportService } from './transport.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @EventPattern('order_created')
  async handleOrderCreated(
    @Payload() data: { orderId: number; productId: number; quantity: number },
  ) {
    console.log(
      `[Transport Service] Received order_created event for Order ID: ${data.orderId}`,
    );

    return this.transportService.handleOrderCreated(data);
  }
}
