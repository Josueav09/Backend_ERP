// backend/services/user-service/src/controllers/ejecutiva/ejecutiva.controller.ts
// import { Controller, Get, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
// import { EjecutivaService } from '../../services/ejecutiva/ejecutiva.service';

// @Controller('ejecutiva')
// export class EjecutivaController {
//   constructor(private readonly ejecutivaService: EjecutivaService) {}

//   @Get('stats')
//   async getStats(@Query('ejecutivaId') ejecutivaId: string) {
//     if (!ejecutivaId) {
//       throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaService.getStats(ejecutivaId);
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Get('empresas')
//   async getEmpresas(@Query('ejecutivaId') ejecutivaId: string) {
//     if (!ejecutivaId) {
//       throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaService.getEmpresas(ejecutivaId);
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener empresas', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Post('empresas')
//   async createEmpresa(@Body() body: any) {
//     const { nombre_empresa, rut, direccion, telefono, email_contacto, ejecutivaId } = body;

//     if (!ejecutivaId) {
//       throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaService.createEmpresa({
//         nombre_empresa,
//         rut,
//         direccion,
//         telefono,
//         email_contacto,
//         ejecutivaId
//       });
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al crear empresa', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Get('clientes')
//   async getClientes(@Query('ejecutivaId') ejecutivaId: string) {
//     if (!ejecutivaId) {
//       throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaService.getClientes(ejecutivaId);
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener clientes', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   @Post('clientes')
//   async createCliente(@Body() body: any) {
//     const { id_empresa, id_ejecutiva, nombre_cliente, rut_cliente, direccion, telefono, email } = body;

//     if (!id_empresa || !id_ejecutiva) {
//       throw new HttpException('Empresa y ejecutiva requeridos', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaService.createCliente({
//         id_empresa,
//         id_ejecutiva,
//         nombre_cliente,
//         rut_cliente,
//         direccion,
//         telefono,
//         email
//       });
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al crear cliente', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }


// backend/services/user-service/src/controllers/ejecutiva/ejecutiva.controller.ts
import { Controller, Get, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { EjecutivaService } from '../../services/ejecutiva/ejecutiva.service';

@Controller('ejecutiva')
export class EjecutivaController {
  constructor(private readonly ejecutivaService: EjecutivaService) {}

  @Get('stats')
  async getStats(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.getStats(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener estadísticas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('empresas')
  async getEmpresas(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.getEmpresas(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener empresas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('empresas')
  async createEmpresa(@Body() body: any) {
    const { 
      razon_social,  // ✅ Cambiado de nombre_empresa
      ruc, 
      direccion, 
      telefono, 
      correo,        // ✅ Cambiado de email_contacto
      ejecutivaId 
    } = body;

    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    // Validaciones básicas
    if (!razon_social || !ruc || !correo) {
      throw new HttpException('Razón social, RUC y correo son requeridos', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.createEmpresa({
        razon_social,
        ruc,
        direccion,
        telefono,
        correo,
        ejecutivaId
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear empresa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('clientes')
  async getClientes(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.getClientes(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener clientes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('clientes')
  async createCliente(@Body() body: any) {
    const { 
      id_empresa, 
      id_ejecutiva, 
      razon_social,  // ✅ Cambiado de nombre_cliente
      ruc,           // ✅ Cambiado de rut_cliente
      direccion, 
      telefono, 
      correo         // ✅ Cambiado de email
    } = body;

    if (!id_empresa || !id_ejecutiva) {
      throw new HttpException('Empresa y ejecutiva requeridos', HttpStatus.BAD_REQUEST);
    }

    // Validaciones básicas
    if (!razon_social || !ruc) {
      throw new HttpException('Razón social y RUC son requeridos', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.createCliente({
        id_empresa,
        id_ejecutiva,
        razon_social,
        ruc,
        direccion,
        telefono,
        correo
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ NUEVO ENDPOINT: Obtener pipeline de ventas de la ejecutiva
  @Get('pipeline')
  async getPipeline(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.getPipeline(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener pipeline', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ NUEVO ENDPOINT: Obtener actividades recientes
  @Get('actividades')
  async getActividadesRecientes(
    @Query('ejecutivaId') ejecutivaId: string,
    @Query('limit') limit: string = '10'
  ) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.getActividadesRecientes(ejecutivaId, parseInt(limit));
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener actividades', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}