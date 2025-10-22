// // backend/services/user-service/src/controllers/ejecutiva/ejecutiva.controller.ts
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
//     const { 
//       razon_social,  // ✅ Cambiado de nombre_empresa
//       ruc, 
//       direccion, 
//       telefono, 
//       correo,        // ✅ Cambiado de email_contacto
//       ejecutivaId 
//     } = body;

//     if (!ejecutivaId) {
//       throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
//     }

//     // Validaciones básicas
//     if (!razon_social || !ruc || !correo) {
//       throw new HttpException('Razón social, RUC y correo son requeridos', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaService.createEmpresa({
//         razon_social,
//         ruc,
//         direccion,
//         telefono,
//         correo,
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
//     const { 
//       id_empresa, 
//       id_ejecutiva, 
//       razon_social,  // ✅ Cambiado de nombre_cliente
//       ruc,           // ✅ Cambiado de rut_cliente
//       direccion, 
//       telefono, 
//       correo         // ✅ Cambiado de email
//     } = body;

//     if (!id_empresa || !id_ejecutiva) {
//       throw new HttpException('Empresa y ejecutiva requeridos', HttpStatus.BAD_REQUEST);
//     }

//     // Validaciones básicas
//     if (!razon_social || !ruc) {
//       throw new HttpException('Razón social y RUC son requeridos', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaService.createCliente({
//         id_empresa,
//         id_ejecutiva,
//         razon_social,
//         ruc,
//         direccion,
//         telefono,
//         correo
//       });
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al crear cliente', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   // ✅ NUEVO ENDPOINT: Obtener pipeline de ventas de la ejecutiva
//   @Get('pipeline')
//   async getPipeline(@Query('ejecutivaId') ejecutivaId: string) {
//     if (!ejecutivaId) {
//       throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaService.getPipeline(ejecutivaId);
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener pipeline', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   // ✅ NUEVO ENDPOINT: Obtener actividades recientes
//   @Get('actividades')
//   async getActividadesRecientes(
//     @Query('ejecutivaId') ejecutivaId: string,
//     @Query('limit') limit: string = '10'
//   ) {
//     if (!ejecutivaId) {
//       throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
//     }

//     try {
//       return await this.ejecutivaService.getActividadesRecientes(ejecutivaId, parseInt(limit));
//     } catch (error) {
//       if (error instanceof HttpException) throw error;
//       throw new HttpException('Error al obtener actividades', HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }
// }

// backend/services/user-service/src/controllers/ejecutiva/ejecutiva.controller.ts
import { Controller, Get, Post, Body, Query, HttpException, HttpStatus } from '@nestjs/common';
import { EjecutivaService } from '../../services/ejecutiva/ejecutiva.service';

@Controller('ejecutiva')
export class EjecutivaController {
  constructor(private readonly ejecutivaService: EjecutivaService) { }

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

  // ✅ CORREGIDO: Registro de empresa (estado Pendiente)
  @Post('empresas/registrar')
  async registrarEmpresa(@Body() body: any) {
    const {
      razon_social,
      ruc,
      direccion,
      telefono,
      correo,
      ejecutivaId,
      // ✅ AGREGAR TODOS LOS CAMPOS
      pagina_web,
      contraseña,
      pais,
      departamento,
      provincia,
      linkedin,
      grupo_economico,
      rubro,
      sub_rubro,
      tamanio_empresa,
      facturacion_anual,
      cantidad_empleados
    } = body;

    console.log('📨 Datos recibidos en backend:', body); // ✅ DEBUG

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
        ejecutivaId,
        pagina_web,
        contraseña,
        pais,
        departamento,
        provincia,
        linkedin,
        grupo_economico,
        rubro,
        sub_rubro,
        tamanio_empresa,
        facturacion_anual,
        cantidad_empleados
      });
    } catch (error) {
      console.error('❌ Error en controller:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al registrar empresa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // ✅ NUEVO: Obtener empresas registradas por la ejecutiva
  @Get('empresas/registradas')
  async getEmpresasRegistradas(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.getEmpresasRegistradas(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener empresas registradas', HttpStatus.INTERNAL_SERVER_ERROR);
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

  // ✅ CORREGIDO: Crear cliente final

  @Post('clientes')
  async createCliente(@Body() body: any) {
    const {
      razon_social,
      ruc,
      direccion,
      telefono,
      correo,
      ejecutivaId,
      // ✅ AGREGAR TODOS LOS CAMPOS
      pagina_web,
      pais,
      departamento,
      provincia,
      linkedin,
      grupo_economico,
      rubro,
      sub_rubro,
      tamanio_empresa,
      facturacion_anual,
      cantidad_empleados
    } = body;

    console.log('📨 Datos recibidos para crear cliente:', body); // ✅ DEBUG

    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    // Validaciones básicas
    if (!razon_social || !ruc) {
      throw new HttpException('Razón social y RUC son requeridos', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.createCliente({
        razon_social,
        ruc,
        direccion,
        telefono,
        correo,
        ejecutivaId,
        pagina_web,
        pais,
        departamento,
        provincia,
        linkedin,
        grupo_economico,
        rubro,
        sub_rubro,
        tamanio_empresa,
        facturacion_anual,
        cantidad_empleados
      });
    } catch (error) {
      console.error('❌ Error en controller crear cliente:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear cliente', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ NUEVO: Crear persona de contacto


  @Post('contactos')
  async createContacto(@Body() body: any) {
    const {
      nombre_completo,
      cargo,
      correo,
      telefono,
      id_cliente_final,
      ejecutivaId,
      // ✅ AGREGAR CAMPOS ADICIONALES
      dni,
      linkedin
    } = body;

    console.log('📨 Datos recibidos para crear contacto:', body); // ✅ DEBUG

    if (!ejecutivaId || !id_cliente_final) {
      throw new HttpException('Ejecutiva y cliente son requeridos', HttpStatus.BAD_REQUEST);
    }

    // Validaciones básicas
    if (!nombre_completo || !correo) {
      throw new HttpException('Nombre completo y correo son requeridos', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.createPersonaContacto({
        nombre_completo,
        cargo,
        correo,
        telefono,
        id_cliente_final,
        ejecutivaId,
        dni,
        linkedin
      });
    } catch (error) {
      console.error('❌ Error en controller crear contacto:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al crear contacto', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ NUEVO: Obtener contactos de un cliente
  @Get('contactos')
  async getContactos(
    @Query('clienteId') clienteId: string,
    @Query('ejecutivaId') ejecutivaId: string
  ) {
    if (!clienteId || !ejecutivaId) {
      throw new HttpException('Cliente y ejecutiva son requeridos', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.getContactosCliente(clienteId, ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener contactos', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ ENDPOINT: Obtener pipeline de ventas de la ejecutiva
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

  // ✅ ENDPOINT: Obtener actividades recientes
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

  // ✅ ENDPOINT: Obtener KPIs semanales
  @Get('kpis/semanales')
  async getKPIsSemanales(@Query('ejecutivaId') ejecutivaId: string) {
    if (!ejecutivaId) {
      throw new HttpException('ID de ejecutiva requerido', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ejecutivaService.getKPIsSemanales(ejecutivaId);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException('Error al obtener KPIs', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}