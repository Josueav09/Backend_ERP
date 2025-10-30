import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from 'shared/entities/EmpresaProveedora.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(ClienteFinal)
    private clienteRepository: Repository<ClienteFinal>,

    @InjectRepository(Ejecutiva)
    private ejecutivaRepository: Repository<Ejecutiva>,

    @InjectRepository(EmpresaProveedora) // ✅ AGREGAR ESTO
    private empresaProveedoraRepository: Repository<EmpresaProveedora>,

  ) { }

  /**
   * Obtener todos los clientes finales con información de ejecutiva y actividades
   */
  // En tu clientes.service.ts - modifica el método findAll
  async findAll() {
    try {
      console.log('📋 [ClientesService] Obteniendo todos los clientes finales...');

      // PRIMERO: Obtener clientes con las relaciones
      const clientes = await this.clienteRepository
        .createQueryBuilder('cf')
        .leftJoinAndSelect('cf.ejecutiva', 'ejecutiva')
        .leftJoinAndSelect('cf.empresa_proveedora', 'empresa')
        .orderBy('cf.fecha_creacion', 'DESC')
        .getMany();

      console.log(`✅ [ClientesService] ${clientes.length} clientes básicos encontrados`);

      // SEGUNDO: Obtener counts de trazabilidades
      const clientesConCounts = await Promise.all(
        clientes.map(async (cliente) => {
          const count = await this.clienteRepository
            .createQueryBuilder('cf')
            .leftJoin('cf.trazabilidades', 'trazabilidad')
            .where('cf.id_cliente_final = :id', { id: cliente.id_cliente_final })
            .select('COUNT(trazabilidad.id_trazabilidad)', 'count')
            .getRawOne();

          return {
            ...cliente,
            // Agregar campos formateados para el frontend
            ejecutiva_nombre: cliente.ejecutiva?.nombre_completo || 'Sin asignar',
            empresa_nombre: cliente.empresa_proveedora?.razon_social || 'Sin asignar',
            total_actividades: parseInt(count?.count) || 0
          };
        })
      );

      console.log(`✅ [ClientesService] ${clientesConCounts.length} clientes procesados con counts`);

      // Para debug: mostrar estructura completa del primer cliente
      if (clientesConCounts.length > 0) {
        console.log('📊 Estructura completa del primer cliente:', JSON.stringify(clientesConCounts[0], null, 2));
      }

      return clientesConCounts;

    } catch (error) {
      console.error('❌ [ClientesService] Error detallado:', error);
      throw new HttpException(
        `Error al obtener clientes finales: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Obtener un cliente final por ID
   */
  async findOne(id: number) {
    try {
      console.log(`🔍 [ClientesService] Buscando cliente con ID: ${id}`);

      const cliente = await this.clienteRepository.findOne({
        where: { id_cliente_final: id },
        relations: ['ejecutiva', 'empresa_proveedora', 'trazabilidades'] // ✅ AGREGAR empresa_proveedora
      });

      if (!cliente) {
        throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
      }

      // Contar actividades
      const totalActividades = cliente.trazabilidades?.length || 0;

      console.log(`✅ [ClientesService] Cliente encontrado: ${cliente.razon_social}`);

      return {
        ...cliente,
        total_actividades: totalActividades,
        ejecutiva_nombre: cliente.ejecutiva?.nombre_completo,
        empresa_nombre: cliente.empresa_proveedora?.razon_social, // ✅ AGREGAR
        estado: cliente.estado
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('❌ [ClientesService] Error al obtener cliente:', error);
      throw new HttpException(
        'Error al obtener el cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  /**
 * ✅ NUEVO: Activar un cliente
 */
  // async activate(id: number) {
  //   try {
  //     console.log(`🔄 [ClientesService] Activando cliente ID: ${id}`);

  //     const cliente = await this.clienteRepository.findOne({
  //       where: { id_cliente_final: id }
  //     });

  //     if (!cliente) {
  //       throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
  //     }

  //     // ✅ Activar el cliente cambiando su estado
  //     await this.clienteRepository.update(id, { 
  //       estado: 'Activo',
  //       fecha_actualizacion: new Date()
  //     });

  //     console.log(`✅ [ClientesService] Cliente activado: ${cliente.razon_social}`);

  //     return { 
  //       message: 'Cliente activado exitosamente',
  //       cliente: {
  //         id_cliente_final: id,
  //         razon_social: cliente.razon_social,
  //         estado: 'Activo'
  //       }
  //     };

  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     console.error('❌ [ClientesService] Error al activar cliente:', error);
  //     throw new HttpException(
  //       'Error al activar el cliente',
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  /**
   * Crear un nuevo cliente final
   */
  async create(data: any) {
    try {
      console.log('➕ [ClientesService] Creando nuevo cliente:', data.razon_social);

      // Validaciones existentes...
      if (!data.razon_social) {
        throw new HttpException('La razón social es obligatoria', HttpStatus.BAD_REQUEST);
      }

      if (!data.id_ejecutiva) {
        throw new HttpException('Debe asignar una ejecutiva', HttpStatus.BAD_REQUEST);
      }

      if (!data.id_empresa_prov) {
        throw new HttpException('Debe asignar una empresa proveedora', HttpStatus.BAD_REQUEST);
      }

      // Verificar que la ejecutiva existe
      const ejecutiva = await this.ejecutivaRepository.findOne({
        where: { id_ejecutiva: data.id_ejecutiva }
      });

      if (!ejecutiva) {
        throw new HttpException('La ejecutiva seleccionada no existe', HttpStatus.BAD_REQUEST);
      }

      // ✅ AGREGAR: Verificar que la empresa existe
      const empresa = await this.empresaProveedoraRepository.findOne({
        where: { id_empresa_prov: data.id_empresa_prov }
      });

      if (!empresa) {
        throw new HttpException('La empresa proveedora seleccionada no existe', HttpStatus.BAD_REQUEST);
      }

      // Verificar RUC duplicado si se proporciona
      if (data.ruc) {
        const existeRuc = await this.clienteRepository.findOne({
          where: { ruc: data.ruc, empresa_proveedora: { id_empresa_prov: data.id_empresa_prov } }
        });

        if (existeRuc) {
          throw new HttpException('Ya existe un cliente con ese RUC en esta empresa', HttpStatus.CONFLICT);
        }
      }

      // Crear cliente
      const nuevoCliente = this.clienteRepository.create({
        ruc: data.ruc || null,
        razon_social: data.razon_social,
        pagina_web: data.pagina_web || null,
        correo: data.correo || null,
        telefono: data.telefono || null,
        pais: data.pais || 'Perú',
        departamento: data.departamento || null,
        provincia: data.provincia || null,
        direccion: data.direccion || null,
        linkedin: data.linkedin || null,
        grupo_economico: data.grupo_economico || null,
        rubro: data.rubro || null,
        sub_rubro: data.sub_rubro || null,
        tamanio_empresa: data.tamanio_empresa || null,
        facturacion_anual: data.facturacion_anual || null,
        cantidad_empleados: data.cantidad_empleados || null,
        logo: data.logo || null,
        ejecutiva: ejecutiva,
        empresa_proveedora: empresa, // ✅ AGREGAR
        estado: 'Activo'
      });

      const clienteGuardado = await this.clienteRepository.save(nuevoCliente);

      console.log(`✅ [ClientesService] Cliente creado con ID: ${clienteGuardado.id_cliente_final}`);

      return {
        ...clienteGuardado,
        ejecutiva_nombre: ejecutiva.nombre_completo,
        empresa_nombre: empresa.razon_social, // ✅ AGREGAR
        total_actividades: 0,
        estado: 'Activo'
      };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('❌ [ClientesService] Error al crear cliente:', error);
      throw new HttpException(
        error.message || 'Error al crear el cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Actualizar un cliente final
   */
  //   async update(id: number, data: any) {
  //     try {
  //       console.log(`📝 [ClientesService] Actualizando cliente ID: ${id}`);

  //       const cliente = await this.clienteRepository.findOne({
  //         where: { id_cliente_final: id },
  //         relations: ['ejecutiva']
  //       });

  //       if (!cliente) {
  //         throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
  //       }

  //       // Verificar ejecutiva si se está cambiando
  //       if (data.id_ejecutiva && data.id_ejecutiva !== cliente.ejecutiva?.id_ejecutiva) {
  //         const ejecutiva = await this.ejecutivaRepository.findOne({
  //           where: { id_ejecutiva: data.id_ejecutiva }
  //         });

  //         if (!ejecutiva) {
  //           throw new HttpException('La ejecutiva seleccionada no existe', HttpStatus.BAD_REQUEST);
  //         }

  //         cliente.ejecutiva = ejecutiva;
  //       }

  //       // Verificar RUC duplicado si se está cambiando
  //       if (data.ruc && data.ruc !== cliente.ruc) {
  //         const existeRuc = await this.clienteRepository.findOne({
  //           where: { ruc: data.ruc }
  //         });

  //         if (existeRuc && existeRuc.id_cliente_final !== id) {
  //           throw new HttpException('Ya existe un cliente con ese RUC', HttpStatus.CONFLICT);
  //         }
  //       }

  //       // Actualizar campos
  //       if (data.ruc !== undefined) cliente.ruc = data.ruc;
  //       if (data.razon_social) cliente.razon_social = data.razon_social;
  //       if (data.pagina_web !== undefined) cliente.pagina_web = data.pagina_web;
  //       if (data.correo !== undefined) cliente.correo = data.correo;
  //       if (data.telefono !== undefined) cliente.telefono = data.telefono;
  //       if (data.pais !== undefined) cliente.pais = data.pais;
  //       if (data.departamento !== undefined) cliente.departamento = data.departamento;
  //       if (data.provincia !== undefined) cliente.provincia = data.provincia;
  //       if (data.direccion !== undefined) cliente.direccion = data.direccion;
  //       if (data.linkedin !== undefined) cliente.linkedin = data.linkedin;
  //       if (data.grupo_economico !== undefined) cliente.grupo_economico = data.grupo_economico;
  //       if (data.rubro !== undefined) cliente.rubro = data.rubro;
  //       if (data.sub_rubro !== undefined) cliente.sub_rubro = data.sub_rubro;
  //       if (data.tamanio_empresa !== undefined) cliente.tamanio_empresa = data.tamanio_empresa;
  //       if (data.facturacion_anual !== undefined) cliente.facturacion_anual = data.facturacion_anual;
  //       if (data.cantidad_empleados !== undefined) cliente.cantidad_empleados = data.cantidad_empleados;
  //       if (data.logo !== undefined) cliente.logo = data.logo;
  //       // En el método update, después de los otros campos:
  //     if (data.estado !== undefined) {
  //       cliente.estado = data.estado;
  // }
  //       cliente.fecha_actualizacion = new Date();

  //       const clienteActualizado = await this.clienteRepository.save(cliente);

  //       console.log(`✅ [ClientesService] Cliente actualizado: ${clienteActualizado.razon_social}`);

  //       return {
  //         ...clienteActualizado,
  //         ejecutiva_nombre: clienteActualizado.ejecutiva?.nombre_completo,
  //         estado: 'Activo' // ✅ Cambiar a 'Activo'
  //       };

  //     } catch (error) {
  //       if (error instanceof HttpException) {
  //         throw error;
  //       }
  //       console.error('❌ [ClientesService] Error al actualizar cliente:', error);
  //       throw new HttpException(
  //         'Error al actualizar el cliente',
  //         HttpStatus.INTERNAL_SERVER_ERROR
  //       );
  //     }
  //   }

  /**
   * ✅ UPDATE CORREGIDO - No forzar estado
   */
  async update(id: number, data: any) {
    try {
      console.log(`📝 [ClientesService] Actualizando cliente ID: ${id}`);

      const cliente = await this.clienteRepository.findOne({
        where: { id_cliente_final: id },
        relations: ['ejecutiva', 'empresa_proveedora']
      });

      if (!cliente) {
        throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
      }

      // ✅ Validar estados permitidos
      if (data.estado && !['Activo', 'Inactivo'].includes(data.estado)) {
        throw new HttpException(
          'Estado inválido. Use: Activo o Inactivo',
          HttpStatus.BAD_REQUEST
        );
      }

      // ... resto de validaciones (ejecutiva, RUC, etc.)

      // Actualizar campos
      if (data.ruc !== undefined) cliente.ruc = data.ruc;
      if (data.razon_social) cliente.razon_social = data.razon_social;
      if (data.pagina_web !== undefined) cliente.pagina_web = data.pagina_web;
      if (data.correo !== undefined) cliente.correo = data.correo;
      if (data.telefono !== undefined) cliente.telefono = data.telefono;
      if (data.pais !== undefined) cliente.pais = data.pais;
      if (data.departamento !== undefined) cliente.departamento = data.departamento;
      if (data.provincia !== undefined) cliente.provincia = data.provincia;
      if (data.direccion !== undefined) cliente.direccion = data.direccion;
      if (data.linkedin !== undefined) cliente.linkedin = data.linkedin;
      if (data.grupo_economico !== undefined) cliente.grupo_economico = data.grupo_economico;
      if (data.rubro !== undefined) cliente.rubro = data.rubro;
      if (data.sub_rubro !== undefined) cliente.sub_rubro = data.sub_rubro;
      if (data.tamanio_empresa !== undefined) cliente.tamanio_empresa = data.tamanio_empresa;
      if (data.facturacion_anual !== undefined) cliente.facturacion_anual = data.facturacion_anual;
      if (data.cantidad_empleados !== undefined) cliente.cantidad_empleados = data.cantidad_empleados;
      if (data.logo !== undefined) cliente.logo = data.logo;

      // ✅ Estado: usar el que viene en data, no forzar
      if (data.estado !== undefined) {
        cliente.estado = data.estado;
      }

      cliente.fecha_actualizacion = new Date();

      const clienteActualizado = await this.clienteRepository.save(cliente);

      console.log(`✅ [ClientesService] Cliente actualizado: ${clienteActualizado.razon_social}`);

      // ✅ CORREGIDO: Retornar el estado real, no forzar 'Activo'
      return {
        ...clienteActualizado,
        ejecutiva_nombre: clienteActualizado.ejecutiva?.nombre_completo,
        empresa_nombre: clienteActualizado.empresa_proveedora?.razon_social,
        estado: clienteActualizado.estado // ← ESTO ES LO QUE SE CORRIGE
      };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('❌ [ClientesService] Error al actualizar cliente:', error);
      throw new HttpException(
        'Error al actualizar el cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  /**
 * ✅ ACTIVAR CLIENTE - Endpoint específico
 */
  // async activate(id: number) {
  //   try {
  //     console.log(`🔄 [ClientesService] Activando cliente ID: ${id}`);

  //     const cliente = await this.clienteRepository.findOne({
  //       where: { id_cliente_final: id }
  //     });

  //     if (!cliente) {
  //       throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
  //     }

  //     // ✅ Solo activar si está inactivo
  //     if (cliente.estado === 'Activo') {
  //       throw new HttpException(
  //         'El cliente ya se encuentra activo',
  //         HttpStatus.BAD_REQUEST
  //       );
  //     }

  //     // ✅ Activar el cliente
  //     await this.clienteRepository.update(id, {
  //       estado: 'Activo',
  //       fecha_actualizacion: new Date()
  //     });

  //     console.log(`✅ [ClientesService] Cliente activado: ${cliente.razon_social}`);

  //     return {
  //       success: true,
  //       message: 'Cliente activado exitosamente',
  //       cliente: {
  //         id_cliente_final: id,
  //         razon_social: cliente.razon_social,
  //         estado: 'Activo'
  //       }
  //     };

  //   } catch (error) {
  //     if (error instanceof NotFoundException || error instanceof HttpException) {
  //       throw error;
  //     }
  //     console.error('❌ [ClientesService] Error al activar cliente:', error);
  //     throw new HttpException(
  //       'Error al activar el cliente',
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

async activate(id: number) {
  try {
    console.log(`🔄 [ClientesService] Activando cliente ID: ${id}`);

    const cliente = await this.clienteRepository.findOne({
      where: { id_cliente_final: id }
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    // ✅ Verificar que no esté ya activo
    if (cliente.estado === 'Activo') {
      throw new HttpException(
        'El cliente ya se encuentra activo',
        HttpStatus.BAD_REQUEST
      );
    }

    // ✅ Activar usando UPDATE
    await this.clienteRepository.update(id, {
      estado: 'Activo',
      fecha_actualizacion: new Date()
    });

    console.log(`✅ [ClientesService] Cliente activado: ${cliente.razon_social}`);
    
    return {
      success: true,
      message: 'Cliente activado exitosamente',
      cliente: {
        id_cliente_final: id,
        razon_social: cliente.razon_social,
        estado: 'Activo'
      }
    };

  } catch (error) {
    console.error('❌ [ClientesService] Error al activar cliente:', error);
    
    if (error instanceof NotFoundException || error instanceof HttpException) {
      throw error;
    }
    
    throw new HttpException(
      'Error al activar el cliente',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

  /**
   * ✅ DESACTIVAR CLIENTE - Endpoint específico
   */
  async deactivate(id: number) {
    try {
      console.log(`🔄 [ClientesService] Desactivando cliente ID: ${id}`);

      const cliente = await this.clienteRepository.findOne({
        where: { id_cliente_final: id }
      });

      if (!cliente) {
        throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
      }

      // ✅ Solo desactivar si está activo
      if (cliente.estado === 'Inactivo') {
        throw new HttpException(
          'El cliente ya se encuentra inactivo',
          HttpStatus.BAD_REQUEST
        );
      }

      // ✅ Desactivar el cliente
      await this.clienteRepository.update(id, {
        estado: 'Inactivo',
        fecha_actualizacion: new Date()
      });

      console.log(`✅ [ClientesService] Cliente desactivado: ${cliente.razon_social}`);

      return {
        success: true,
        message: 'Cliente desactivado exitosamente',
        cliente: {
          id_cliente_final: id,
          razon_social: cliente.razon_social,
          estado: 'Inactivo'
        }
      };

    } catch (error) {
      if (error instanceof NotFoundException || error instanceof HttpException) {
        throw error;
      }
      console.error('❌ [ClientesService] Error al desactivar cliente:', error);
      throw new HttpException(
        'Error al desactivar el cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



  /**
  * Desactivar un cliente final (soft delete - cambiar estado a Inactivo)
  */
  // async remove(id: number) { 
  //   try {
  //     console.log(`🗑️ [ClientesService] Desactivando cliente ID: ${id}`);

  //     const cliente = await this.clienteRepository.findOne({
  //       where: { id_cliente_final: id }
  //     });

  //     if (!cliente) {
  //       throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
  //     }

  //     // ✅ CORREGIDO: Cambiar estado a 'Inactivo' en lugar de eliminar
  //     await this.clienteRepository.update(id, { 
  //       estado: 'Inactivo',
  //       fecha_actualizacion: new Date()
  //     });

  //     console.log(`✅ [ClientesService] Cliente desactivado: ${cliente.razon_social}`);

  //     return { 
  //       message: 'Cliente desactivado exitosamente',
  //       cliente: {
  //         id_cliente_final: id,
  //         razon_social: cliente.razon_social,
  //         estado: 'Inactivo'
  //       }
  //     };

  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     console.error('❌ [ClientesService] Error al desactivar cliente:', error);
  //     throw new HttpException(
  //       'Error al desactivar el cliente',
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

// async remove(id: number) {
//   try {
//     console.log(`🗑️ [ClientesService] Desactivando cliente ID: ${id}`);

//     // ✅ BUSCAR CLIENTE
//     const cliente = await this.clienteRepository.findOne({
//       where: { id_cliente_final: id }
//     });

//     console.log(`🔍 [ClientesService] Cliente encontrado:`, cliente);

//     if (!cliente) {
//       throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
//     }

//     // ✅ VERIFICAR SI YA ESTÁ INACTIVO
//     if (cliente.estado === 'Inactivo') {
//       throw new HttpException(
//         'El cliente ya se encuentra inactivo',
//         HttpStatus.BAD_REQUEST
//       );
//     }

//     // ✅ CORREGIDO: USAR UPDATE PARA CAMBIAR ESTADO
//     console.log(`🔄 [ClientesService] Actualizando estado a Inactivo para cliente ID: ${id}`);
    
//     const updateResult = await this.clienteRepository.update(
//       { id_cliente_final: id },
//       { 
//         estado: 'Inactivo',
//         fecha_actualizacion: new Date()
//       }
//     );

//     console.log(`✅ [ClientesService] Update result:`, updateResult);
//     console.log(`✅ [ClientesService] Cliente desactivado: ${cliente.razon_social}`);
    
//     return {
//       success: true,
//       message: 'Cliente desactivado exitosamente',
//       cliente: {
//         id_cliente_final: id,
//         razon_social: cliente.razon_social,
//         estado: 'Inactivo'
//       }
//     };

//   } catch (error) {
//     console.error('❌ [ClientesService] Error detallado al desactivar cliente:', error);
    
//     if (error instanceof NotFoundException || error instanceof HttpException) {
//       throw error;
//     }
    
//     throw new HttpException(
//       `Error interno al desactivar cliente: ${error.message}`,
//       HttpStatus.INTERNAL_SERVER_ERROR
//     );
//   }
// }
}