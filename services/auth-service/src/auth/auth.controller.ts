

// backend/services/auth-service/src/auth/auth.controller.ts
import { Controller, Post, Body, Ip, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 🎲 GET /auth/captcha
   * Genera un nuevo captcha
   */
  @Get('captcha')
  @HttpCode(HttpStatus.OK)
  async getCaptcha() {
    return this.authService.generateCaptcha();
  }

  /**
   * 🔐 POST /auth/login
   * Valida credenciales y envía código 2FA
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Ip() clientIp: string) {
    return this.authService.login(loginDto, clientIp);
  }

  /**
   * ✉️ POST /auth/verify-email
   * Valida código 2FA y retorna JWT
   */
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyDto: VerifyEmailDto) {
    return this.authService.verifyEmailCode(verifyDto);
  }
}