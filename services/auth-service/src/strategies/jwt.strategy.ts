// // backend/services/auth-service/src/auth/strategies/jwt.strategy.ts
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../users/entities/users.entity';

// interface JwtPayload {
//   sub: number;
//   email: string;
//   rol: string;
// }

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private configService: ConfigService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key-change-in-production',
//     });
//   }

//   /**
//    * 🔐 Validar JWT y retornar usuario
//    */
//   async validate(payload: JwtPayload) {
//     const { sub, email } = payload;

//     const user = await this.userRepository.findOne({
//       where: { id_usuario: sub, email, activo: true },
//     });

//     if (!user) {
//       throw new UnauthorizedException('Usuario no válido o inactivo');
//     }

//     return user;
//   }
// }

// backend/services/auth-service/src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ✅ IMPORTAR LAS NUEVAS ENTIDADES
import { Jefe } from '../../../../shared/entities/Jefe.entity';
import { EmpresaProveedora } from '../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../shared/entities/Ejecutiva.entity';

interface JwtPayload {
  sub: number;
  email: string;
  rol: string;
  userType: string; // ✅ AGREGAR userType
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // ✅ INYECTAR REPOSITORIOS DE LAS NUEVAS ENTIDADES
    @InjectRepository(Jefe)
    private jefeRepository: Repository<Jefe>,

    @InjectRepository(EmpresaProveedora)
    private empresaRepository: Repository<EmpresaProveedora>,

    @InjectRepository(Ejecutiva)
    private ejecutivaRepository: Repository<Ejecutiva>,

    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-secret-key-change-in-production',
    });
  }

  /**
   * 🔐 Validar JWT y retornar usuario
   */
  async validate(payload: JwtPayload) {
    console.log('🔐 JWR.STRATEGY.TS Payload recibido:', payload); // ← ¿Incluye userType?
    console.log('🔐 Buscando userType:', payload.userType);
    console.log('🔐 Sub (ID):', payload.sub);
    const { sub, email, rol, userType } = payload;

    let user: any = null;

    // ✅ BUSCAR EN LA TABLA CORRECTA SEGÚN userType
    switch (userType) {
      case 'jefe':
        user = await this.jefeRepository.findOne({
          where: { id_jefe: sub, correo: email }
        });
        break;

      case 'empresa':
        user = await this.empresaRepository.findOne({
          where: {
            id_empresa_prov: sub,
            correo: email,
            estado: 'Activo'
          }
        });
        break;

      case 'ejecutiva':
        user = await this.ejecutivaRepository.findOne({
          where: {
            id_ejecutiva: sub,
            correo: email,
            estado_ejecutiva: 'Activo'
          }
        });
        break;

      default:
        throw new UnauthorizedException('Tipo de usuario no válido');
    }

    if (!user) {
      throw new UnauthorizedException('Usuario no válido o inactivo');
    }

    return {
      id_jefe: user.id_jefe, // ← ESTO ES LO QUE TU CONTROLADOR ESPERA
      id_empresa_prov: user.id_empresa_prov,
      id_ejecutiva: user.id_ejecutiva,
      userType: userType,
      correo: user.correo,
      rol: user.rol,
      // ... otros campos que necesites
      userEntity: user // ← mantener la entidad completa por si acaso
    };
  }
}
