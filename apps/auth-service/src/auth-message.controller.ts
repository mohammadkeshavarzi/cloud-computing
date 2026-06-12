import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthServiceService } from './auth-service.service';

@Controller()
export class AuthMessageController {
  constructor(private readonly authService: AuthServiceService) {}

  @MessagePattern({ cmd: 'login_user' })
  async handleLogin(@Payload() data: any) {
    // داده‌های ارسالی از گیت‌وی در دیتا قرار دارد
    return this.authService.validateAndGenerateToken(data);
  }
}
