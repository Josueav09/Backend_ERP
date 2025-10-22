// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
// import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
// import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
// import * as bcrypt from 'bcryptjs';

// @Injectable()
// export class EmpresasService {
//   constructor(
//     @InjectRepository(EmpresaProveedora)
//     private empresaRepository: Repository<EmpresaProveedora>,

//     @InjectRepository(Ejecutiva)
//     private ejecutivaRepository: Repository<Ejecutiva>,

//     @InjectRepository(ClienteFinal)
//     private clienteRepository: Repository<ClienteFinal>,
//   ) { }

//   async getEmpresas() {
//     const empresas = await this.empresaRepository.find({
//       order: { estado: 'DESC', razon_social: 'ASC' }
//     });

//     // Enriquecer con estadísticas
//     const empresasConStats = await Promise.all(
//       empresas.map(async (empresa) => {
//         const [totalEjecutivas, totalClientes] = await Promise.all([
//           this.ejecutivaRepository.count({
//             where: {
//               empresa_proveedora: { id_empresa_prov: empresa.id_empresa_prov },
//               estado_ejecutiva: 'Activo'
//             }
//           }),
//           this.clienteRepository.count({
//             where: { ejecutiva: { empresa_proveedora: { id_empresa_prov: empresa.id_empresa_prov } } }
//           })
//         ]);

//         return {
//           ...empresa,
//           total_ejecutivas: totalEjecutivas,
//           total_clientes: totalClientes
//         };
//       })
//     );

//     return empresasConStats;
//   }

//   // async createEmpresa(data: any) {
//   //   const { ruc, razon_social, correo, contraseña, telefono, pagina_web, rubro } = data;

//   //   // Verificar RUC único
//   //   const existingEmpresa = await this.empresaRepository.findOne({
//   //     where: { ruc }
//   //   });

//   //   if (existingEmpresa) {
//   //     throw new HttpException('Ya existe una empresa con este RUC', HttpStatus.BAD_REQUEST);
//   //   }

//   //   // Verificar email único
//   //   const existingEmail = await this.empresaRepository.findOne({
//   //     where: { correo }
//   //   });

//   //   if (existingEmail) {
//   //     throw new HttpException('Ya existe una empresa con este email', HttpStatus.BAD_REQUEST);
//   //   }

//   //   // Hashear contraseña
//   //   const bcrypt = require('bcryptjs');
//   //   const hashedPassword = await bcrypt.hash(contraseña, 10);

//   //   const nuevaEmpresa = this.empresaRepository.create({
//   //     ruc,
//   //     razon_social,
//   //     correo,
//   //     contraseña: hashedPassword,
//   //     telefono: telefono || null,
//   //     pagina_web: pagina_web || null,
//   //     rubro: rubro || null,
//   //     estado: 'Activo'
//   //   });

//   //   return await this.empresaRepository.save(nuevaEmpresa);
//   // }

//   async createEmpresa(data: any) {
//     console.log('📥 Datos recibidos para crear empresa:', data); // ← DEBUG

//     const { ruc, razon_social, correo, contraseña, telefono, pagina_web, rubro } = data;

//     // Verificar RUC único
//     const existingEmpresa = await this.empresaRepository.findOne({
//       where: { ruc }
//     });

//     if (existingEmpresa) {
//       throw new HttpException('Ya existe una empresa con este RUC', HttpStatus.BAD_REQUEST);
//     }

//     // Verificar email único
//     const existingEmail = await this.empresaRepository.findOne({
//       where: { correo }
//     });

//     if (existingEmail) {
//       throw new HttpException('Ya existe una empresa con este email', HttpStatus.BAD_REQUEST);
//     }

//     // ✅ HASHEAR CONTRASEÑA CORRECTAMENTE
//     const hashedPassword = await bcrypt.hash(contraseña, 10);

//     const nuevaEmpresa = this.empresaRepository.create({
//       ruc,
//       razon_social,
//       correo,
//       contraseña: hashedPassword, // ✅ Campo correcto
//       telefono: telefono || null,
//       pagina_web: pagina_web || null,
//       rubro: rubro || null,
//       estado: 'Activo'
//     });

//     return await this.empresaRepository.save(nuevaEmpresa);
//   }

//   async updateEmpresaEstado(empresaId: number, activo: boolean) {
//     const empresa = await this.empresaRepository.findOne({
//       where: { id_empresa_prov: empresaId }
//     });

//     if (!empresa) {
//       throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
//     }

//     empresa.estado = activo ? 'Activo' : 'Inactivo';
//     empresa.fecha_actualizacion = new Date();

//     // Si se desactiva la empresa, desactivar también sus ejecutivas
//     if (!activo) {
//       await this.ejecutivaRepository.update(
//         { empresa_proveedora: { id_empresa_prov: empresaId } },
//         { estado_ejecutiva: 'Inactivo' }
//       );
//     }

//     await this.empresaRepository.save(empresa);

//     return {
//       empresa,
//       message: `Empresa ${activo ? 'activada' : 'desactivada'} correctamente`
//     };
//   }

//   // En EmpresasService.ts - agregar este método
//   async updateEmpresa(empresaId: number, data: any) {
//     console.log('📝 Actualizando empresa ID:', empresaId, 'con datos:', data);

//     const empresa = await this.empresaRepository.findOne({
//       where: { id_empresa_prov: empresaId }
//     });

//     if (!empresa) {
//       throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
//     }

//     // Verificar si el RUC ya existe en otra empresa
//     if (data.ruc && data.ruc !== empresa.ruc) {
//       const existingRuc = await this.empresaRepository.findOne({
//         where: { ruc: data.ruc }
//       });

//       if (existingRuc) {
//         throw new HttpException('Ya existe una empresa con este RUC', HttpStatus.BAD_REQUEST);
//       }
//     }

//     // Verificar si el email ya existe en otra empresa
//     if (data.correo && data.correo !== empresa.correo) {
//       const existingEmail = await this.empresaRepository.findOne({
//         where: { correo: data.correo }
//       });

//       if (existingEmail) {
//         throw new HttpException('Ya existe una empresa con este email', HttpStatus.BAD_REQUEST);
//       }
//     }

//     // Actualizar solo los campos proporcionados
//     if (data.razon_social) empresa.razon_social = data.razon_social;
//     if (data.ruc) empresa.ruc = data.ruc;
//     if (data.correo) empresa.correo = data.correo;
//     if (data.telefono !== undefined) empresa.telefono = data.telefono;
//     if (data.direccion !== undefined) empresa.direccion = data.direccion;
//     if (data.pagina_web !== undefined) empresa.pagina_web = data.pagina_web;
//     if (data.rubro !== undefined) empresa.rubro = data.rubro;
//     if (data.tamanio_empresa) empresa.tamanio_empresa = data.tamanio_empresa;

//     empresa.fecha_actualizacion = new Date();

//     try {
//       const empresaActualizada = await this.empresaRepository.save(empresa);
//       console.log('✅ Empresa actualizada exitosamente:', empresaActualizada.id_empresa_prov);
//       return empresaActualizada;
//     } catch (error) {
//       console.error('❌ Error al actualizar empresa:', error);
//       throw new HttpException(
//         'Error interno del servidor al actualizar empresa',
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   async getEmpresaEjecutivas(empresaId: number) {
//     const empresa = await this.empresaRepository.findOne({
//       where: { id_empresa_prov: empresaId },
//       relations: ['ejecutivas']
//     });

//     if (!empresa) {
//       throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
//     }

//     // Enriquecer ejecutivas con estadísticas
//     const ejecutivasConStats = await Promise.all(
//       empresa.ejecutivas.map(async (ejecutiva) => {
//         const totalClientes = await this.clienteRepository.count({
//           where: { ejecutiva: { id_ejecutiva: ejecutiva.id_ejecutiva } }
//         });

//         return {
//           ...ejecutiva,
//           total_clientes: totalClientes
//         };
//       })
//     );

//     return {
//       ...empresa,
//       ejecutivas: ejecutivasConStats
//     };
//   }

//   async addEjecutivaToEmpresa(empresaId: number, ejecutivaId: number) {
//     const empresa = await this.empresaRepository.findOne({
//       where: { id_empresa_prov: empresaId }
//     });

//     if (!empresa) {
//       throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
//     }

//     const ejecutiva = await this.ejecutivaRepository.findOne({
//       where: { id_ejecutiva: ejecutivaId }
//     });

//     if (!ejecutiva) {
//       throw new HttpException('Ejecutiva no encontrada', HttpStatus.NOT_FOUND);
//     }

//     // Verificar si ya está asignada
//     if (ejecutiva.empresa_proveedora && ejecutiva.empresa_proveedora.id_empresa_prov === empresaId) {
//       throw new HttpException('Esta ejecutiva ya está asignada a esta empresa', HttpStatus.BAD_REQUEST);
//     }

//     // Asignar ejecutiva a la empresa
//     ejecutiva.empresa_proveedora = empresa;
//     ejecutiva.fecha_actualizacion = new Date();

//     await this.ejecutivaRepository.save(ejecutiva);

//     return {
//       message: 'Ejecutiva asignada correctamente a la empresa',
//       ejecutiva: {
//         id_ejecutiva: ejecutiva.id_ejecutiva,
//         nombre_completo: ejecutiva.nombre_completo,
//         correo: ejecutiva.correo
//       }
//     };
//   }

//   async removeEjecutivaFromEmpresa(empresaId: number, ejecutivaId: number) {
//     const ejecutiva = await this.ejecutivaRepository.findOne({
//       where: {
//         id_ejecutiva: ejecutivaId,
//         empresa_proveedora: { id_empresa_prov: empresaId }
//       },
//       relations: ['empresa_proveedora']
//     });

//     if (!ejecutiva) {
//       throw new HttpException('Ejecutiva no encontrada en esta empresa', HttpStatus.NOT_FOUND);
//     }

//     // Remover asignación
//     ejecutiva.empresa_proveedora = null;
//     ejecutiva.fecha_actualizacion = new Date();

//     await this.ejecutivaRepository.save(ejecutiva);

//     return { message: 'Ejecutiva removida correctamente de la empresa' };
//   }
// }

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(EmpresaProveedora)
    private empresaRepository: Repository<EmpresaProveedora>,

    @InjectRepository(Ejecutiva)
    private ejecutivaRepository: Repository<Ejecutiva>,

    @InjectRepository(ClienteFinal)
    private clienteRepository: Repository<ClienteFinal>,
  ) { }

  async getEmpresas() {
    const empresas = await this.empresaRepository.find({
      order: { estado: 'DESC', razon_social: 'ASC' }
    });

    // Enriquecer con estadísticas
    const empresasConStats = await Promise.all(
      empresas.map(async (empresa) => {
        const [totalEjecutivas, totalClientes] = await Promise.all([
          this.ejecutivaRepository.count({
            where: {
              empresa_proveedora: { id_empresa_prov: empresa.id_empresa_prov },
              estado_ejecutiva: 'Activo'
            }
          }),
          this.clienteRepository.count({
            where: { ejecutiva: { empresa_proveedora: { id_empresa_prov: empresa.id_empresa_prov } } }
          })
        ]);

        return {
          ...empresa,
          total_ejecutivas: totalEjecutivas,
          total_clientes: totalClientes
        };
      })
    );

    return empresasConStats;
  }

  async createEmpresa(data: any) {
    console.log('📥 Datos recibidos para crear empresa:', data); // ← DEBUG

    const { ruc, razon_social, correo, contraseña, telefono, pagina_web, rubro } = data;

    // Verificar RUC único
    const existingEmpresa = await this.empresaRepository.findOne({
      where: { ruc }
    });

    if (existingEmpresa) {
      throw new HttpException('Ya existe una empresa con este RUC', HttpStatus.BAD_REQUEST);
    }

    // Verificar email único
    const existingEmail = await this.empresaRepository.findOne({
      where: { correo }
    });

    if (existingEmail) {
      throw new HttpException('Ya existe una empresa con este email', HttpStatus.BAD_REQUEST);
    }

    // ✅ HASHEAR CONTRASEÑA CORRECTAMENTE
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const nuevaEmpresa = this.empresaRepository.create({
      ruc,
      razon_social,
      correo,
      contraseña: hashedPassword, // ✅ Campo correcto
      telefono: telefono || null,
      pagina_web: pagina_web || null,
      rubro: rubro || null,
      estado: 'Activo'
    });

    return await this.empresaRepository.save(nuevaEmpresa);
  }

  // En EmpresasService.ts - Método alternativo más simple
// En EmpresasService.ts - MODIFICAR el método updateEmpresaEstado
async updateEmpresaEstado(empresaId: number, activo: boolean) {
  console.log('🔄 [EmpresasService] Cambiando estado de empresa:', { empresaId, activo });

  const empresa = await this.empresaRepository.findOne({
    where: { id_empresa_prov: empresaId }
  });

  if (!empresa) {
    throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
  }

  // Guardar el estado anterior para auditoría
  const estadoAnterior = empresa.estado;
  empresa.estado = activo ? 'Activo' : 'Inactivo';
  empresa.fecha_actualizacion = new Date();

  // Obtener IDs de ejecutivas de esta empresa
  const ejecutivasEmpresa = await this.ejecutivaRepository.find({
    where: { empresa_proveedora: { id_empresa_prov: empresaId } },
    select: ['id_ejecutiva']
  });

  const idsEjecutivas = ejecutivasEmpresa.map(ej => ej.id_ejecutiva);

  if (idsEjecutivas.length > 0) {
    if (!activo) {
      // ✅ Desactivar empresa: Desactivar clientes
      console.log('➖ [EmpresasService] Desactivando clientes de la empresa:', empresaId);
      
      const resultDesactivar = await this.clienteRepository
        .createQueryBuilder()
        .update()
        .set({ 
          estado: 'Inactivo',
          fecha_actualizacion: new Date()
        })
        .where('id_ejecutiva IN (:...idsEjecutivas)', { idsEjecutivas })
        .execute();

      console.log('✅ [EmpresasService] Clientes desactivados:', resultDesactivar.affected);

    } else {
      // ✅ Activar empresa: Activar clientes automáticamente
      console.log('➕ [EmpresasService] Activando empresa Y clientes:', empresaId);
      
      const resultActivar = await this.clienteRepository
        .createQueryBuilder()
        .update()
        .set({ 
          estado: 'Activo',
          fecha_actualizacion: new Date()
        })
        .where('id_ejecutiva IN (:...idsEjecutivas)', { idsEjecutivas })
        .andWhere('estado = :estado', { estado: 'Inactivo' }) // Solo activar los que estaban inactivos
        .execute();

      console.log('✅ [EmpresasService] Clientes activados:', resultActivar.affected);
    }
  } else {
    console.log('ℹ️ [EmpresasService] No hay ejecutivas en esta empresa');
  }

  await this.empresaRepository.save(empresa);

  // ✅ Auditoría
  console.log('📝 [EmpresasService] Auditoría: Empresa', empresa.razon_social, 
              'cambió de', estadoAnterior, 'a', empresa.estado);

  return {
    empresa,
    message: `Empresa ${activo ? 'activada' : 'desactivada'} correctamente. ` +
             `${!activo ? 'Los clientes asociados han sido desactivados.' : 'Los clientes asociados han sido activados.'}`
  };
}

  // En EmpresasService.ts - agregar este método
  async updateEmpresa(empresaId: number, data: any) {
    console.log('📝 Actualizando empresa ID:', empresaId, 'con datos:', data);

    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa_prov: empresaId }
    });

    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }

    // Verificar si el RUC ya existe en otra empresa
    if (data.ruc && data.ruc !== empresa.ruc) {
      const existingRuc = await this.empresaRepository.findOne({
        where: { ruc: data.ruc }
      });

      if (existingRuc) {
        throw new HttpException('Ya existe una empresa con este RUC', HttpStatus.BAD_REQUEST);
      }
    }

    // Verificar si el email ya existe en otra empresa
    if (data.correo && data.correo !== empresa.correo) {
      const existingEmail = await this.empresaRepository.findOne({
        where: { correo: data.correo }
      });

      if (existingEmail) {
        throw new HttpException('Ya existe una empresa con este email', HttpStatus.BAD_REQUEST);
      }
    }

    // Actualizar solo los campos proporcionados
    if (data.razon_social) empresa.razon_social = data.razon_social;
    if (data.ruc) empresa.ruc = data.ruc;
    if (data.correo) empresa.correo = data.correo;
    if (data.telefono !== undefined) empresa.telefono = data.telefono;
    if (data.direccion !== undefined) empresa.direccion = data.direccion;
    if (data.pagina_web !== undefined) empresa.pagina_web = data.pagina_web;
    if (data.rubro !== undefined) empresa.rubro = data.rubro;
    if (data.tamanio_empresa) empresa.tamanio_empresa = data.tamanio_empresa;

    empresa.fecha_actualizacion = new Date();

    try {
      const empresaActualizada = await this.empresaRepository.save(empresa);
      console.log('✅ Empresa actualizada exitosamente:', empresaActualizada.id_empresa_prov);
      return empresaActualizada;
    } catch (error) {
      console.error('❌ Error al actualizar empresa:', error);
      throw new HttpException(
        'Error interno del servidor al actualizar empresa',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getEmpresaEjecutivas(empresaId: number) {
    console.log('🏢 [EmpresasService] Obteniendo ejecutivas de empresa:', empresaId);

    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa_prov: empresaId }
    });

    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }

    // ✅ Obtener ejecutivas ASIGNADAS a esta empresa
    const ejecutivasAsignadas = await this.ejecutivaRepository.find({
      where: { 
        empresa_proveedora: { id_empresa_prov: empresaId },
        estado_ejecutiva: 'Activo'
      },
      order: { nombre_completo: 'ASC' }
    });

    console.log('✅ [EmpresasService] Ejecutivas asignadas:', ejecutivasAsignadas.length);

    // ✅ Formatear para el frontend
    const ejecutivasFormateadas = await Promise.all(
      ejecutivasAsignadas.map(async (ej) => {
        const totalClientes = await this.clienteRepository.count({
          where: { ejecutiva: { id_ejecutiva: ej.id_ejecutiva } }
        });

        return {
          id_usuario: ej.id_ejecutiva,
          nombre: ej.nombre_completo.split(' ')[0] || '',
          apellido: ej.nombre_completo.split(' ').slice(1).join(' ') || '',
          email: ej.correo,
          fecha_asignacion: ej.fecha_actualizacion,
          activo: ej.estado_ejecutiva === 'Activo',
          total_clientes: totalClientes
        };
      })
    );

    return {
      id_empresa_prov: empresa.id_empresa_prov,
      razon_social: empresa.razon_social,
      ruc: empresa.ruc,
      ejecutivas: ejecutivasFormateadas
    };
  }

  async addEjecutivaToEmpresa(empresaId: number, ejecutivaId: number) {
    console.log('➕ [EmpresasService] Asignando ejecutiva:', { empresaId, ejecutivaId });

    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa_prov: empresaId }
    });

    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }

    const ejecutiva = await this.ejecutivaRepository.findOne({
      where: { id_ejecutiva: ejecutivaId },
      relations: ['empresa_proveedora'] // ✅ Cargar relación
    });

    if (!ejecutiva) {
      throw new HttpException('Ejecutiva no encontrada', HttpStatus.NOT_FOUND);
    }

    // ✅ Verificar si ya está asignada a ESTA empresa
    if (ejecutiva.empresa_proveedora?.id_empresa_prov === empresaId) {
      throw new HttpException('Esta ejecutiva ya está asignada a esta empresa', HttpStatus.BAD_REQUEST);
    }

    // ✅ Verificar si ya está asignada a OTRA empresa
    if (ejecutiva.empresa_proveedora && ejecutiva.empresa_proveedora.id_empresa_prov !== empresaId) {
      throw new HttpException(
        `La ejecutiva ya está asignada a la empresa "${ejecutiva.empresa_proveedora.razon_social}"`,
        HttpStatus.BAD_REQUEST
      );
    }

    // ✅ Asignar ejecutiva a la empresa
    ejecutiva.empresa_proveedora = empresa;
    ejecutiva.fecha_actualizacion = new Date();

    await this.ejecutivaRepository.save(ejecutiva);

    console.log('✅ [EmpresasService] Ejecutiva asignada exitosamente');

    return {
      message: 'Ejecutiva asignada correctamente a la empresa',
      ejecutiva: {
        id_ejecutiva: ejecutiva.id_ejecutiva,
        nombre_completo: ejecutiva.nombre_completo,
        correo: ejecutiva.correo,
        empresa: empresa.razon_social
      }
    };
  }

  async removeEjecutivaFromEmpresa(empresaId: number, ejecutivaId: number) {
    console.log('➖ [EmpresasService] Removiendo ejecutiva:', { empresaId, ejecutivaId });

    const ejecutiva = await this.ejecutivaRepository.findOne({
      where: { 
        id_ejecutiva: ejecutivaId,
        empresa_proveedora: { id_empresa_prov: empresaId }
      },
      relations: ['empresa_proveedora']
    });

    if (!ejecutiva) {
      throw new HttpException(
        'Ejecutiva no encontrada o no está asignada a esta empresa',
        HttpStatus.NOT_FOUND
      );
    }

    // ✅ Verificar si tiene clientes asignados
    const clientesCount = await this.clienteRepository.count({
      where: { ejecutiva: { id_ejecutiva: ejecutivaId } }
    });

    if (clientesCount > 0) {
      throw new HttpException(
        `No se puede quitar la ejecutiva porque tiene ${clientesCount} cliente(s) asignado(s). ` +
        `Primero reasigne los clientes a otra ejecutiva.`,
        HttpStatus.BAD_REQUEST
      );
    }

    // ✅ Remover asignación
    ejecutiva.empresa_proveedora = null;
    ejecutiva.fecha_actualizacion = new Date();

    await this.ejecutivaRepository.save(ejecutiva);

    console.log('✅ [EmpresasService] Ejecutiva removida exitosamente');

    return { 
      message: 'Ejecutiva removida correctamente de la empresa',
      ejecutiva: {
        id_ejecutiva: ejecutiva.id_ejecutiva,
        nombre_completo: ejecutiva.nombre_completo
      }
    };
  }
}