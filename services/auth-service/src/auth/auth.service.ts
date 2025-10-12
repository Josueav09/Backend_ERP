
// backend/services/auth-service/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/users.entity';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  // 🔹 Map para códigos captcha temporales
  private captchaMap = new Map<string, string>();

  // 🔹 Map para códigos de verificación por email
  private tempEmailCodes = new Map<string, string>();
 
  // 🔹 Intentos fallidos
  private userAttempts = new Map<string, { count: number; lastAttempt: number }>();
  private ipAttempts = new Map<string, { count: number; lastAttempt: number }>();

  private readonly MAX_USER_ATTEMPTS = 7;
  private readonly MAX_IP_ATTEMPTS = 5;
  private readonly BLOCK_DURATION = 30 * 60 * 1000; // 30 min
  private readonly CAPTCHA_EXPIRY = 5 * 60 * 1000; // 5 min

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  /**
   * 🎲 Generar captcha
   */
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

  /**
   * ✅ Validar captcha
   */
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

  /**
   * 🔐 LOGIN: Validar usuario, password y enviar código 2FA
   */
  async login(loginDto: LoginDto, clientIp: string) {
    
    const { email, password, captchaToken, captchaResponse } = loginDto;

    // 1️⃣ Validar captcha
    if (!captchaToken || !captchaResponse) {
      throw new BadRequestException('Por favor complete el captcha');
    }
    
    this.validateCaptcha(captchaToken, captchaResponse);

    // 2️⃣ Verificar intentos fallidos (usuario e IP)
    this.checkBlockedAttempts(email, clientIp);

    // 3️⃣ Buscar usuario activo
    const user = await this.userRepository.findOne({
      where: { email, activo: true },
    });

    if (!user) {
      this.recordFailedAttempt(email, clientIp);
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    // 4️⃣ Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      this.recordFailedAttempt(email, clientIp);
      const remaining = this.getRemainingAttempts(email, clientIp);
      throw new UnauthorizedException(
        `Contraseña incorrecta. ${remaining.user} intentos restantes para el usuario. ${remaining.ip} intentos restantes para esta IP.`,
      );
    }

    // 5️⃣ Limpiar intentos fallidos
    this.clearFailedAttempts(email, clientIp);

    // 6️⃣ Generar código temporal de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.tempEmailCodes.set(user.email, code);

    // ✅ Auto-expirar código en 5 minutos
    setTimeout(() => {
      this.tempEmailCodes.delete(user.email);
    }, this.CAPTCHA_EXPIRY);

    // 7️⃣ Enviar código por email
    try {
      await this.emailService.sendVerificationCode(user.email, code);
      console.log(`✅ Código enviado a ${user.email}: ${code}`);
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      throw new HttpException(
        'No se pudo enviar el código de verificación',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // 8️⃣ Retornar respuesta indicando que requiere verificación
    return {
      success: true,
      requiresEmailVerification: true,
      email: user.email,
      userId: user.id_usuario,
      rol: user.rol,
      name: `${user.nombre} ${user.apellido}`.trim(),
    };
  }

  /**
   * ✉️ VERIFY EMAIL: Validar código 2FA y generar JWT
   */
  async verifyEmailCode(verifyDto: VerifyEmailDto) {
    const { email, code } = verifyDto;

    // 1️⃣ Verificar código temporal
    const expectedCode = this.tempEmailCodes.get(email);

    if (!expectedCode || expectedCode !== code) {
      throw new UnauthorizedException('Código inválido o expirado');
    }

    // 2️⃣ Eliminar código temporal
    this.tempEmailCodes.delete(email);

    // 3️⃣ Buscar usuario
    const user = await this.userRepository.findOne({
      where: { email, activo: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // 4️⃣ Actualizar última conexión
    user.ultima_conexion = new Date();
    await this.userRepository.save(user);

    // 5️⃣ Generar JWT
    const payload = {
      sub: user.id_usuario,
      email: user.email,
      rol: user.rol,
    };
    const accessToken = this.jwtService.sign(payload);

    // 6️⃣ Retornar respuesta con token
    return {
      success: true,
      userId: user.id_usuario,
      email: user.email,
      rol: user.rol,
      name: `${user.nombre} ${user.apellido}`.trim(),
      accessToken,
    };
  }

  /**
   * 🚫 Verificar si el usuario o IP está bloqueado
   */
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

  /**
   * 📝 Registrar intento fallido
   */
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

  /**
   * ✅ Limpiar intentos fallidos tras login exitoso
   */
  private clearFailedAttempts(email: string, ip: string) {
    this.userAttempts.delete(email);
    this.ipAttempts.delete(ip);
  }

  /**
   * 📊 Obtener intentos restantes
   */
  private getRemainingAttempts(email: string, ip: string) {
    const userCount = this.userAttempts.get(email)?.count || 0;
    const ipCount = this.ipAttempts.get(ip)?.count || 0;

    return {
      user: this.MAX_USER_ATTEMPTS - userCount,
      ip: this.MAX_IP_ATTEMPTS - ipCount,
    };
  }
}