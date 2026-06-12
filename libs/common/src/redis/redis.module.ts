import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST, // در فاز داکر به نام سرویس رادیس تغییر می‌کند
          port: parseInt(process.env.REDIS_PORT!),
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class SharedRedisModule {}
