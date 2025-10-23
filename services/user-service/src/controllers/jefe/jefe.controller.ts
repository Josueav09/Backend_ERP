// import { Controller, Get, Put, Body, Request, HttpException, HttpStatus } from '@nestjs/common';
// import { UseGuards } from '@nestjs/common';
// //import { SimpleJwtGuard } from '../../../../../shared/guards/simple-jwt.guard';
// import { JefeService } from '../../services/jefe/jefe.service';
// import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';

// @Controller('jefe')

// export class JefeController {
//   constructor(private readonly jefeService: JefeService) { }

//   @Get('perfil')
//   @UseGuards(JwtAuthGuard)
//   async getPerfil(@Request() req) {
//     console.log('🔐 Headers:', req.headers);
//     console.log('🔐 Authorization:', req.headers.authorization);
//     console.log('🔐 User completo:', req.user); // ← DEBERÍA ESTAR DEFINIDO CON EL GUARD

//     // if (!req.user) {
//     //   throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
//     // }

//     const userId = req.user.id_jefe;
//     console.log('🔐 [JefeController] User ID:', userId);
//     return await this.jefeService.getPerfil(userId);
//   }


//   @Put('perfil')
//   @UseGuards(JwtAuthGuard)
//   async updatePerfil(@Request() req, @Body() body: any) {
//     try {
//       const userId = req.user.id_jefe;
//       return await this.jefeService.updatePerfil(userId, body);
//     } catch (error) {
//       throw new HttpException('Error al actualizar perfil', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Put('password')
//   @UseGuards(JwtAuthGuard)
//   async updatePassword(@Request() req, @Body() body: any) {
//     try {
//       const userId = req.user.id_jefe;
//       const { password_actual, password_nueva } = body;
//       return await this.jefeService.updatePassword(userId, password_actual, password_nueva);
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al actualizar contraseña', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Get('stats')
//   @UseGuards(JwtAuthGuard)
//   async getStats(@Request() req) {
//     console.log('🔐 [JefeController] Headers:', req.headers);
//     console.log('🔐 [JefeController] User:', req.user);
//     console.log('🔐 [JefeController] Authorization:', req.headers.authorization);
//     console.log('🔐 User para stats:', req.user);
//     try {
//       return await this.jefeService.getStats();
//     } catch (error) {
//       const e = error;
//       throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }

import {
  Controller,
  Get,
  Put,
  Body,
  Request,
  HttpException,
  HttpStatus,
  UseGuards,
  Param,
  Post,
  Delete
} from '@nestjs/common';
import { JefeService } from '../../services/jefe/jefe.service';
import { JwtAuthGuard } from '../../../../../shared/guards/jwt-auth.guard';

@Controller('jefe')
export class JefeController {
  constructor(private readonly jefeService: JefeService) { }

  // ============================================
  // PERFIL DEL JEFE
  // ============================================

  @Get('perfil')
  @UseGuards(JwtAuthGuard)
  async getPerfil(@Request() req) {
    console.log('🔐 [JefeController] === OBTENER PERFIL ===');
    console.log('🔐 [JefeController] Headers:', req.headers);
    console.log('🔐 [JefeController] Authorization:', req.headers.authorization);
    console.log('🔐 [JefeController] User completo:', req.user);

    try {
      if (!req.user || !req.user.id_jefe) {
        console.error('❌ [JefeController] Usuario no autenticado o sin id_jefe');
        throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.id_jefe;
      console.log('🔐 [JefeController] User ID extraído:', userId);

      const perfil = await this.jefeService.getPerfil(userId);
      console.log('✅ [JefeController] Perfil obtenido exitosamente');

      return perfil;
    } catch (error) {
      console.error('❌ [JefeController] Error en getPerfil:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al obtener perfil',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('perfil')
  @UseGuards(JwtAuthGuard)
  async updatePerfil(@Request() req, @Body() body: any) {
    console.log('📝 [JefeController] === ACTUALIZAR PERFIL ===');
    console.log('📝 [JefeController] User:', req.user);
    console.log('📝 [JefeController] Body recibido:', body);

    try {
      if (!req.user || !req.user.id_jefe) {
        throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.id_jefe;
      const resultado = await this.jefeService.updatePerfil(userId, body);

      console.log('✅ [JefeController] Perfil actualizado exitosamente');
      return resultado;
    } catch (error) {
      console.error('❌ [JefeController] Error en updatePerfil:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al actualizar perfil',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(@Request() req, @Body() body: any) {
    console.log('🔒 [JefeController] === ACTUALIZAR CONTRASEÑA ===');
    console.log('🔒 [JefeController] User:', req.user);

    try {
      if (!req.user || !req.user.id_jefe) {
        throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.id_jefe;
      const { password_actual, password_nueva } = body;

      if (!password_actual || !password_nueva) {
        throw new HttpException(
          'Contraseña actual y nueva son requeridas',
          HttpStatus.BAD_REQUEST
        );
      }

      const resultado = await this.jefeService.updatePassword(
        userId,
        password_actual,
        password_nueva
      );

      console.log('✅ [JefeController] Contraseña actualizada exitosamente');
      return resultado;
    } catch (error) {
      console.error('❌ [JefeController] Error en updatePassword:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al actualizar contraseña',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  // async getStats(@Request() req) {
  //   console.log('📊 [JefeController] === OBTENER ESTADÍSTICAS ===');
  //   try {
  //     const stats = await this.jefeService.getStats();
  //     console.log('✅ [JefeController] Estadísticas obtenidas:', stats);
  //     return stats;
  //   } catch (error) {
  //     console.error('❌ [JefeController] Error en getStats:', error.message);
  //     console.error(error.stack);
  //     throw new HttpException(
  //       `Error al obtener estadísticas: ${error.message}`,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats(@Request() req) {
    console.log('📊 [JefeController] === OBTENER ESTADÍSTICAS ===');
    console.log('👤 Usuario:', req.user?.id_jefe);

    try {
      const stats = await this.jefeService.getStats();
      console.log('✅ [JefeController] Estadísticas obtenidas exitosamente');
      return stats;
    } catch (error) {
      console.error('❌ [JefeController] Error en getStats:', error.message);
      throw new HttpException(
        `Error al obtener estadísticas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  // ============================================
  // GESTIÓN DE CLIENTES FINALES
  // ============================================


  @Get('cliente')
  @UseGuards(JwtAuthGuard)
  async getClientes(@Request() req) {
    console.log('📋 [JefeController] === OBTENER CLIENTES - INICIANDO ===');
    console.log('👤 Usuario autenticado:', req.user);

    try {
      console.log('🔄 Llamando a jefeService.getClientes()...');
      const clientes = await this.jefeService.getClientes();
      console.log(`✅ [JefeController] ${clientes.length} clientes obtenidos`);
      return clientes;
    } catch (error) {
      console.error('❌ [JefeController] Error en getClientes:', error);
      console.error('🔍 Stack trace:', error.stack);
      throw new HttpException(
        'Error al obtener clientes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  @Get('cliente/:id')
  @UseGuards(JwtAuthGuard)
  async getClienteById(@Param('id') id: string) {
    console.log(`🔍 [JefeController] === OBTENER CLIENTE ${id} ===`);
    try {
      return await this.jefeService.getClienteById(parseInt(id));
    } catch (error) {
      console.error('❌ [JefeController] Error en getClienteById:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al obtener cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('cliente')
  @UseGuards(JwtAuthGuard)
  async createCliente(@Body() body: any) {
    console.log('➕ [JefeController] === CREAR CLIENTE ===');
    console.log('📝 [JefeController] Body:', body);
    try {
      return await this.jefeService.createCliente(body);
    } catch (error) {
      console.error('❌ [JefeController] Error en createCliente:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Error al crear cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('cliente/:id')
  @UseGuards(JwtAuthGuard)
  async updateCliente(@Param('id') id: string, @Body() body: any) {
    console.log(`📝 [JefeController] === ACTUALIZAR CLIENTE ${id} ===`);
    console.log('📝 [JefeController] Body:', body);
    try {
      return await this.jefeService.updateCliente(parseInt(id), body);
    } catch (error) {
      console.error('❌ [JefeController] Error en updateCliente:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error.message || 'Error al actualizar cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('cliente/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCliente(@Param('id') id: string) {
    console.log(`🗑️ [JefeController] === ELIMINAR CLIENTE ${id} ===`);
    try {
      return await this.jefeService.deleteCliente(parseInt(id));
    } catch (error) {
      console.error('❌ [JefeController] Error en deleteCliente:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al eliminar cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}
