// backend/services/auth-service/src/auth/auth.controller.ts
import { Controller, Post, Body, Ip, HttpCode, HttpStatus, Get, HttpException, Headers, Req, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Get()
  @Redirect('/auth/health', 302)
  redirectToHealth() {
    return;
  }

  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      service: 'auth-service',
      timestamp: new Date().toISOString()
    };
  }


  @Get('captcha')
  @HttpCode(HttpStatus.OK)
  async getCaptcha() {
    try {
      return this.authService.generateCaptcha();
    } catch (error) {
      throw new HttpException(
        'Error al generar captcha',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Ip() clientIp: string) {
    try {
      return await this.authService.login(loginDto, clientIp);
    } catch (error) {
      // ✅ Propagar el error con su mensaje original
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error al iniciar sesión',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() verifyDto: VerifyEmailDto) {
    try {
      return await this.authService.verifyEmailCode(verifyDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Error al verificar código',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Headers('authorization') authHeader: string,
    @Req() req: Request
  ) {
    try {
      // 1️⃣ Extraer token del header Authorization
      let token = '';
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else {
        // También intentar obtener del body como fallback
        const bodyToken = (req.body as any)?.token;
        if (bodyToken) {
          token = bodyToken;
        }
      }

      // 2️⃣ Ejecutar logout
      const result = await this.authService.logout(token);

      return result;

    } catch (error) {
      // ✅ Incluso si hay error, retornar éxito para limpieza del frontend
      return {
        success: true,
        message: 'Sesión cerrada'
      };
    }
  }


}