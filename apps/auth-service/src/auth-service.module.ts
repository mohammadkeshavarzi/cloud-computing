import { Module } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthMessageController } from './auth-message.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: 'MY_SUPER_SECRET_KEY',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthMessageController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
