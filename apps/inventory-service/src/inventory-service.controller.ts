import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InventoryService } from './inventory-service.service';

@Controller()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @EventPattern('order_created')
  async handleOrderCreated(@Payload() data: any) {
    console.log('Received order_created event in Inventory:', data);
    await this.inventoryService.checkAndDeductInventory(data);
  }
}
