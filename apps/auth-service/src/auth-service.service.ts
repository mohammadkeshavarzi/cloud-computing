import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthServiceService {
  constructor(private readonly jwtService: JwtService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async validateAndGenerateToken(payload: any) {
    console.log('Payload:', payload);
    if (payload.username === 'admin' && payload.password === '123456') {
      const jwtPayload = { email: payload.email, sub: 1 };
      return {
        access_token: this.jwtService.sign(jwtPayload),
        status: 'success',
      };
    }
    return { status: 'error', message: 'کاربر یافت نشد رفیق!' };
  }
}
