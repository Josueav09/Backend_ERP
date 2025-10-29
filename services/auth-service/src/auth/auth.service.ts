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
    // En tu auth.service.ts - agregar esto en el constructor
    console.log('🔍 DATABASE CONNECTION DEBUG:');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_DATABASE:', process.env.DB_DATABASE);
    console.log('DB_USER:', process.env.DB_USERNAME);
  }

  /**
   * 🔐 LOGIN: Buscar usuario en JEFE, EMPRESA_PROVEEDORA o EJECUTIVA
   */
  async login(loginDto: LoginDto, clientIp: string) {
    const { email, password, captchaToken, captchaResponse } = loginDto;

    // 1️⃣ Validar captcha
    if (!captchaToken || !captchaResponse) {
      throw new BadRequestException('Por favor complete el captcha');
    }
    this.validateCaptcha(captchaToken, captchaResponse);

    // 2️⃣ Verificar intentos fallidos
    this.checkBlockedAttempts(email, clientIp);

    // 3️⃣ 🔍 BUSCAR USUARIO EN LAS TABLAS CORRECTAS
    let user: any = null;
    let userType = '';

    // Buscar en JEFE
    user = await this.jefeRepository.findOne({ where: { correo: email } });
    if (user) {
      userType = 'jefe';
      // ✅ ACTUALIZAR: Usar el rol real de la base de datos
      user.rol = user.rol || 'jefe'; // Si no tiene rol, default 'jefe'
      console.log('🔐 Login - Rol del usuario en BD:', user.rol); // Debug

    } else {
      // Buscar en EMPRESA_PROVEEDORA
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
        // Buscar en EJECUTIVA
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
      this.recordFailedAttempt(email, clientIp);
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    // 4️⃣ 🔐 VERIFICAR CONTRASEÑA
    const validPassword = await bcrypt.compare(password, user.contraseña);
    // Agrega esto temporalmente en tu auth.service.ts para debug
    console.log('🔐 Password debug:');
    console.log('Input password:', password);
    console.log('Stored hash:', user.contraseña);
    console.log('Comparison result:', validPassword);
    if (!validPassword) {
      this.recordFailedAttempt(email, clientIp);
      const remaining = this.getRemainingAttempts(email, clientIp);
      throw new UnauthorizedException(
        `Contraseña incorrecta. ${remaining.user} intentos restantes para el usuario. ${remaining.ip} intentos restantes para esta IP.`,
      );
    }

    // 5️⃣ ✅ Limpiar intentos fallidos
    this.clearFailedAttempts(email, clientIp);

    // 6️⃣ 📧 Generar y enviar código 2FA
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.tempEmailCodes.set(email, code);

    setTimeout(() => {
      this.tempEmailCodes.delete(email);
    }, this.CAPTCHA_EXPIRY);

    try {
      await this.emailService.sendVerificationCode(email, code);
      console.log(`✅ Código enviado a ${email}: ${code}`);
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      throw new HttpException(
        'No se pudo enviar el código de verificación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // 7️⃣ 📝 Retornar respuesta
    return {
      success: true,
      requiresEmailVerification: true,
      email: email,
      userId: this.getUserId(user, userType),
      rol: user.rol,
      name: user.nombre_completo,
      userType: userType,
    };
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

    console.log('🔐 JWT Payload generado:', payload); // Debug

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

    console.log('📤 Respuesta verifyEmail:', response); // Debug

    return response;
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
    console.log(`✅ Captcha validado correctamente`);
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

    console.log(`🔐 Captcha generado: ${result} (token: ${token})`);
    return { captchaText: result, captchaToken: token };
  }

}
