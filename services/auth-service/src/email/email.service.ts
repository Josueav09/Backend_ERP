// backend/services/auth-service/src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { 
  getVerificationCodeEmailHTML, 
  getVerificationCodeEmailText 
} from './templates/verification-email.templates';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // ✅ Configurar nodemailer con tus credenciales de Growvia
    this.transporter = nodemailer.createTransport({
      host: 'mail.growvia.global',
      port: 465,
      secure: true, // true para puerto 465, false para otros puertos
      auth: {
        user: 'marketing@growvia.global',
        pass: '*zr(0lm=6Zw8',
      },
      // Opcional: configurar timeouts
      connectionTimeout: 10000, // 10 segundos
      greetingTimeout: 10000,
    });

    // Verificar conexión al iniciar
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Error conectando con servidor de email:', error);
      } else {
        console.log('✅ Servidor de email listo para enviar mensajes');
      }
    });
  }

  /**
   * 📧 Enviar código de verificación por email
   */
  async sendVerificationCode(email: string, code: string): Promise<void> {

    try {
      const info = await this.transporter.sendMail({
        from: '"Growvia - Verificación de Cuenta" <marketing@growvia.global>',
        to: email,
        subject: 'Código de Verificación - Growvia',
        text: getVerificationCodeEmailText(code),
        html: getVerificationCodeEmailHTML(code),
      });
      
    } catch (error) {
      throw error;
    }
  }
}