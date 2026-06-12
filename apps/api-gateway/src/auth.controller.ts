import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // ارسال پیام به الگوی 'login_user' در رادیس و منتظر ماندن برای پاسخ (RPC)
    return this.authClient.send({ cmd: 'login_user' }, loginDto);
  }
}
