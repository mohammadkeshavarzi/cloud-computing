// apps/api-gateway/src/orders.controller.ts
import {
  Controller,
  Post,
  Body,
  Inject,
  HttpException,
  HttpStatus,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import e from 'express';
import * as CircuitBreaker from 'opossum';
import { timeout, retry, catchError, throwError, firstValueFrom } from 'rxjs';

@Controller('orders')
export class OrdersController implements OnModuleInit {
  private breaker: CircuitBreaker;

  constructor(
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
  ) {}

  onModuleInit() {
    const runCall = (body: any) =>
      firstValueFrom(this.orderClient.send({ cmd: 'create_order' }, body));

    this.breaker = new CircuitBreaker(runCall, {
      timeout: 5000,
      errorThresholdPercentage: 50, // اگر ۵۰ درصد ریکوست‌ها در یک بازه زمانی خطا دادند، فیوز رو بپرون (Open)
      resetTimeout: 10000,
    });

    this.breaker.on('open', () =>
      console.warn('🚨 فیوز پرید! ارتباط با سرویس سفارشات قطع شد.'),
    );
    this.breaker.on('close', () =>
      console.log('✅ فیوز بسته شد. سرویس سفارشات به وضعیت عادی برگشت.'),
    );
    this.breaker.on('halfOpen', () =>
      console.log('🔄 فیوز نیمه‌باز شد. در حال تست سرویس مقصد...'),
    );
  }

  @Post()
  async createOrder(@Body() body: { productId: number; quantity: number }) {
    // return this.orderClient.send({ cmd: 'create_order' }, body).pipe(
    //   timeout(5000),

    //   retry(3),

    //   catchError((err) => {
    //     console.error(
    //       'خطا در ارتباط با سرویس سفارشات پس از ۳ بار تلاش:',
    //       err.message,
    //     );
    //     return throwError(
    //       () =>
    //         new HttpException(
    //           'سرویس سفارشات موقتاً در دسترس نیست. لطفاً دوباره تلاش کنید.',
    //           HttpStatus.SERVICE_UNAVAILABLE,
    //         ),
    //     );
    //   }),
    // );

    try {
      return await this.breaker.fire(body);
    } catch (error) {
      if (error.message === 'Open' || this.breaker.opened) {
        throw new HttpException(
          'سرویس سفارشات به دلیل خرابی موقتاً کاملاً مسدود شده است (Circuit Breaker Open)',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
