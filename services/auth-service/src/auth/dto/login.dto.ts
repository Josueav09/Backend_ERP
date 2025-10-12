// backend/services/auth-service/src/auth/dto/login.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(3, { message: 'La contraseña debe tener al menos 3 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El token de captcha es obligatorio' })
  captchaToken: string;

  @IsString()
  @IsNotEmpty({ message: 'Debe ingresar el texto del captcha' })
  captchaResponse: string;
}