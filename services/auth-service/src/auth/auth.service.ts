// backend/services/auth-service/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// ✅ USAR SOLO LAS ENTIDADES DEL ESQUEMA ORIGINAL
import { Jefe } from '../../../../shared/entities/Jefe.entity';
import { EmpresaProveedora } from '../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../shared/entities/Ejecutiva.entity';

import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private captchaMap = new Map<string, string>();
  private tempEmailCodes = new Map<string, string>();
  private userAttempts = new Map<string, { count: number; lastAttempt: number }>();
  private ipAttempts = new Map<string, { count: number; lastAttempt: number }>();
  private tokenBlacklist = new Set<string>();

  private readonly TOKEN_BLACKLIST_EXPIRY = 24 * 60 * 60 * 1000; // 24 horas
  private readonly MAX_USER_ATTEMPTS = 7;
  private readonly MAX_IP_ATTEMPTS = 5;
  private readonly BLOCK_DURATION = 30 * 60 * 1000;
  private readonly CAPTCHA_EXPIRY = 5 * 60 * 1000;

  constructor(

    // ✅ SOLO los repositorios del esquema original
    @InjectRepository(Jefe)
    private jefeRepository: Repository<Jefe>,

    @InjectRepository(EmpresaProveedora)
    private empresaRepository: Repository<EmpresaProveedora>,

    @InjectRepository(Ejecutiva)
    private ejecutivaRepository: Repository<Ejecutiva>,

    private jwtService: JwtService,
    private emailService: EmailService,

  ) {
  }

  async login(loginDto: LoginDto, clientIp: string) {
    const { email, password, captchaToken, captchaResponse } = loginDto;

    try {
      // 1️⃣ Validar captcha PRIMERO
      if (!captchaToken || !captchaResponse) {
        throw new BadRequestException('Por favor complete el captcha');
      }

      try {
        this.validateCaptcha(captchaToken, captchaResponse);
      } catch (error) {
        // ✅ Captcha inválido - mensaje específico
        throw new BadRequestException('Captcha incorrecto. Por favor intente nuevamente');
      }

      // 2️⃣ Verificar intentos fallidos
      this.checkBlockedAttempts(email, clientIp);

      // 3️⃣ Buscar usuario
      let user: any = null;
      let userType = '';

      user = await this.jefeRepository.findOne({ where: { correo: email } });
      if (user) {
        userType = 'jefe';
        user.rol = user.rol || 'jefe';
      } else {
        user = await this.empresaRepository.findOne({
          where: { correo: email, estado: 'Activo' }
        });
        if (user) {
          userType = 'empresa';
          user.rol = 'empresa';
        } else {
          user = await this.ejecutivaRepository.findOne({
            where: { correo: email, estado_ejecutiva: 'Activo' }
          });
          if (user) {
            userType = 'ejecutiva';
            user.rol = 'ejecutiva';
          }
        }
      }

      // ✅ Usuario no encontrado - mensaje específico
      if (!user) {
        this.recordFailedAttempt(email, clientIp);
        const remaining = this.getRemainingAttempts(email, clientIp);
        throw new UnauthorizedException(
          `Credenciales incorrectas. ${remaining.user} intentos restantes`
        );
      }

      // 4️⃣ Verificar contraseña
      const validPassword = await bcrypt.compare(password, user.contraseña);

      if (!validPassword) {
        this.recordFailedAttempt(email, clientIp);
        const remaining = this.getRemainingAttempts(email, clientIp);

        // ✅ Contraseña incorrecta - mensaje específico
        throw new UnauthorizedException(
          `Contraseña incorrecta. ${remaining.user} intentos restantes para el usuario`
        );
      }

      // 5️⃣ Limpiar intentos
      this.clearFailedAttempts(email, clientIp);

      // 6️⃣ Generar código 2FA
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      this.tempEmailCodes.set(email, code);

      setTimeout(() => {
        this.tempEmailCodes.delete(email);
      }, this.CAPTCHA_EXPIRY);

      // 7️⃣ Enviar código por email
      try {
        await this.emailService.sendVerificationCode(email, code);
      } catch (error) {
        throw new HttpException(
          'No se pudo enviar el código de verificación. Intente nuevamente',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // 8️⃣ Retornar respuesta exitosa
      return {
        success: true,
        requiresEmailVerification: true,
        email: email,
        userId: this.getUserId(user, userType),
        rol: user.rol,
        name: user.nombre_completo,
        userType: userType,
      };

    } catch (error) {
      // ✅ Propagar errores con el mensaje correcto
      if (error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof HttpException) {
        throw error;
      }

      // Error desconocido
      throw new HttpException(
        'Error al procesar la solicitud. Intente nuevamente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



  async verifyEmailCode(verifyDto: VerifyEmailDto) {
    const { email, code } = verifyDto;

    // 1️⃣ Verificar código temporal
    const expectedCode = this.tempEmailCodes.get(email);
    if (!expectedCode || expectedCode !== code) {
      throw new UnauthorizedException('Código inválido o expirado');
    }

    // 2️⃣ Eliminar código temporal
    this.tempEmailCodes.delete(email);

    // 3️⃣ 🔍 Buscar usuario en las tablas correctas
    let user: any = null;
    let userType = '';

    user = await this.jefeRepository.findOne({ where: { correo: email } });
    if (user) {
      userType = 'jefe';
      // ✅ Asegurar que tenemos el rol correcto
      user.rol = user.rol || 'jefe';
    } else {
      user = await this.empresaRepository.findOne({
        where: {
          correo: email,
          estado: 'Activo'
        }
      });
      if (user) {
        userType = 'empresa';
        user.rol = 'empresa';
      } else {
        user = await this.ejecutivaRepository.findOne({
          where: {
            correo: email,
            estado_ejecutiva: 'Activo'
          }
        });
        if (user) {
          userType = 'ejecutiva';
          user.rol = 'ejecutiva';
        }
      }
    }

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // 4️⃣ 📅 Actualizar última conexión
    user.fecha_actualizacion = new Date();

    if (userType === 'jefe') {
      await this.jefeRepository.save(user);
    } else if (userType === 'empresa') {
      await this.empresaRepository.save(user);
    } else if (userType === 'ejecutiva') {
      await this.ejecutivaRepository.save(user);
    }

    // 5️⃣ 🔐 Generar JWT CORREGIDO
    const payload = {
      sub: this.getUserId(user, userType),
      email: email,
      rol: user.rol, // ✅ CORREGIDO: Usar el rol REAL de la BD
      userType: userType,
    };

    const accessToken = this.jwtService.sign(payload);

    // 6️⃣ 📤 Retornar respuesta CORREGIDA
    const response = {
      success: true,
      userId: payload.sub,
      email: email,
      rol: user.rol, // ✅ CORREGIDO: Usar el rol REAL
      name: user.nombre_completo,
      userType: userType,
      accessToken,
    };

    return response;
  }

  /**
   * 🔐 LOGOUT - Invalidar token y limpiar sesión
   */
  async logout(token: string): Promise<{ success: boolean; message: string }> {
    try {
      // 1️⃣ Verificar si el token es válido antes de invalidarlo
      if (token) {
        try {
          const decoded = this.jwtService.verify(token);

          // 2️⃣ Agregar token a la blacklist
          this.tokenBlacklist.add(token);

          // 3️⃣ Programar eliminación automática de la blacklist después de 24h
          setTimeout(() => {
            this.tokenBlacklist.delete(token);
          }, this.TOKEN_BLACKLIST_EXPIRY);

        } catch (error) {
          throw new HttpException(
            'Token inválido o expirado',
            HttpStatus.UNAUTHORIZED
          );
          
        }
      }

      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };

    } catch (error) {
      throw new HttpException(
        'Error al cerrar sesión',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * 🔍 Verificar si un token está en la blacklist
   */
  isTokenBlacklisted(token: string): boolean {
    return this.tokenBlacklist.has(token);
  }

  /**
   * 🧹 Limpiar blacklist antigua (para mantenimiento)
   */
  cleanExpiredBlacklist() {
    // Esta función podría ser llamada periódicamente
    // Para mantener la blacklist bajo control
    console.log(`🧹 Blacklist actual: ${this.tokenBlacklist.size} tokens`);
  }



  /**
   * 🔍 Obtener ID según el tipo de usuario
   */
  private getUserId(user: any, userType: string): number {
    switch (userType) {
      case 'jefe': return user.id_jefe;
      case 'empresa': return user.id_empresa_prov;
      case 'ejecutiva': return user.id_ejecutiva;
      default: return 0;
    }
  }

  // ... (tus otros métodos de captcha e intentos se mantienen igual)
  private validateCaptcha(token: string, userInput: string) {
    const expected = this.captchaMap.get(token);

    if (!expected) {
      throw new BadRequestException('Captcha expirado o inválido. Genere uno nuevo.');
    }

    if (expected.toUpperCase() !== userInput.toUpperCase()) {
      this.captchaMap.delete(token); // eliminar si es incorrecto
      throw new BadRequestException('Captcha incorrecto. Intente nuevamente.');
    }

    // ✅ Eliminar captcha después de uso exitoso (solo se puede usar una vez)
    this.captchaMap.delete(token);
  }

  private checkBlockedAttempts(email: string, ip: string) {
    const now = Date.now();
    const userAttempt = this.userAttempts.get(email);
    const ipAttempt = this.ipAttempts.get(ip);

    // Limpiar intentos antiguos
    if (userAttempt && now - userAttempt.lastAttempt > this.BLOCK_DURATION) {
      this.userAttempts.delete(email);
    }
    if (ipAttempt && now - ipAttempt.lastAttempt > this.BLOCK_DURATION) {
      this.ipAttempts.delete(ip);
    }

    const userCount = this.userAttempts.get(email)?.count || 0;
    const ipCount = this.ipAttempts.get(ip)?.count || 0;

    if (userCount >= this.MAX_USER_ATTEMPTS) {
      throw new HttpException(
        'Cuenta bloqueada por múltiples intentos fallidos. Intente nuevamente en 30 minutos.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    if (ipCount >= this.MAX_IP_ATTEMPTS) {
      throw new HttpException(
        'IP bloqueada por múltiples intentos fallidos. Intente nuevamente en 30 minutos.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private recordFailedAttempt(email: string, ip: string) {
    const now = Date.now();

    // Usuario
    const userAttempt = this.userAttempts.get(email) || { count: 0, lastAttempt: now };
    userAttempt.count += 1;
    userAttempt.lastAttempt = now;
    this.userAttempts.set(email, userAttempt);

    // IP
    const ipAttempt = this.ipAttempts.get(ip) || { count: 0, lastAttempt: now };
    ipAttempt.count += 1;
    ipAttempt.lastAttempt = now;
    this.ipAttempts.set(ip, ipAttempt);
  }

  private clearFailedAttempts(email: string, ip: string) {
    this.userAttempts.delete(email);
    this.ipAttempts.delete(ip);
  }

  private getRemainingAttempts(email: string, ip: string) {
    const userCount = this.userAttempts.get(email)?.count || 0;
    const ipCount = this.ipAttempts.get(ip)?.count || 0;

    return {
      user: this.MAX_USER_ATTEMPTS - userCount,
      ip: this.MAX_IP_ATTEMPTS - ipCount,
    };
  }

  /**
  //    * 🎲 Generar captcha
  //    */
  generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Token único con timestamp
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    this.captchaMap.set(token, result);

    // ✅ Auto-expirar captcha en 5 minutos
    setTimeout(() => {
      this.captchaMap.delete(token);
    }, this.CAPTCHA_EXPIRY);

    return { captchaText: result, captchaToken: token };
  }

}
