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
    try {
      if (!req.user || !req.user.id_jefe) {
        throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.id_jefe;

      const perfil = await this.jefeService.getPerfil(userId);

      return perfil;
    } catch (error) {
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
    try {
      if (!req.user || !req.user.id_jefe) {
        throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.id_jefe;
      const resultado = await this.jefeService.updatePerfil(userId, body);

      return resultado;
    } catch (error) {
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

      return resultado;
    } catch (error) {
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
  async getStats(@Request() req) {
    try {
      const stats = await this.jefeService.getStats();
      return stats;
    } catch (error) {
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
    try {
      const clientes = await this.jefeService.getClientes();
      return clientes;
    } catch (error) {
      throw new HttpException(
        'Error al obtener clientes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  @Get('cliente/:id')
  @UseGuards(JwtAuthGuard)
  async getClienteById(@Param('id') id: string) {
    try {
      return await this.jefeService.getClienteById(parseInt(id));
    } catch (error) {
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
    try {
      return await this.jefeService.createCliente(body);
    } catch (error) {
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
    try {
      return await this.jefeService.updateCliente(parseInt(id), body);
    } catch (error) {
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
    try {
      return await this.jefeService.deleteCliente(parseInt(id));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al eliminar cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}
