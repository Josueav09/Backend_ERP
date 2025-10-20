// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// interface JwtPayload {
//   sub: number;
//   email: string;
//   rol: string;
//   userType: string;
// }

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key-change-in-production',
//     });
//   }

//   async validate(payload: JwtPayload) {
//     console.log('🔐 [Shared JwtStrategy] Validating payload:', payload);
    
//     // ✅ Validación básica - NO necesitamos consultar la BD en cada request
//     // Solo verificamos que el payload tenga la estructura correcta
//     if (!payload.sub || !payload.email || !payload.userType) {
//       throw new UnauthorizedException('Token inválido: estructura incorrecta');
//     }

//     // ✅ Retornamos el payload completo para que esté disponible en req.user
//     return {
//       id: payload.sub,
//       email: payload.email,
//       rol: payload.rol,
//       userType: payload.userType,
//       // Para compatibilidad con tu código existente
//       id_jefe: payload.userType === 'jefe' ? payload.sub : null,
//       id_empresa_prov: payload.userType === 'empresa' ? payload.sub : null,
//       id_ejecutiva: payload.userType === 'ejecutiva' ? payload.sub : null,
//     };
//   }
// }
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: number;
  email: string;
  rol: string;
  userType: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const jwtSecret = configService.get('JWT_SECRET');
    
    // ✅ DEBUG CRÍTICO
    console.log('🔐 [Shared JwtStrategy] JWT_SECRET configurado:', jwtSecret ? 'SÍ' : 'NO');
    console.log('🔐 [Shared JwtStrategy] JWT_SECRET length:', jwtSecret?.length);
    console.log('🔐 [Shared JwtStrategy] JWT_SECRET primeros 10 chars:', jwtSecret?.substring(0, 10) + '...');
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret || 'fallback-secret',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('🔐 [Shared JwtStrategy] Validando payload:', payload);
    
    if (!payload.sub || !payload.email || !payload.userType) {
      console.log('❌ [Shared JwtStrategy] Payload incompleto:', {
        sub: payload.sub,
        email: payload.email,
        userType: payload.userType
      });
      throw new UnauthorizedException('Token inválido: estructura incorrecta');
    }

    const user = {
      id: payload.sub,
      email: payload.email,
      rol: payload.rol,
      userType: payload.userType,
      id_jefe: payload.userType === 'jefe' ? payload.sub : null,
      id_empresa_prov: payload.userType === 'empresa' ? payload.sub : null,
      id_ejecutiva: payload.userType === 'ejecutiva' ? payload.sub : null,
    };

    console.log('✅ [Shared JwtStrategy] User validado exitosamente:', user);
    return user;
  }
}