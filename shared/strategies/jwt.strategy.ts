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
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret || 'fallback-secret',
    });
  }

  async validate(payload: JwtPayload) {
    
    if (!payload.sub || !payload.email || !payload.userType) {
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

    return user;
  }
}