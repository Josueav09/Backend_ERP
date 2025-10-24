// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
// import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
// import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
// import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
// import { Jefe } from 'shared/entities/Jefe.entity';

// @Injectable()
// export class EjecutivasService {
//   constructor(
//     @InjectRepository(Ejecutiva)
//     private ejecutivaRepository: Repository<Ejecutiva>,

//     @InjectRepository(EmpresaProveedora)
//     private empresaRepository: Repository<EmpresaProveedora>,

//     @InjectRepository(ClienteFinal)
//     private clienteRepository: Repository<ClienteFinal>,

//     @InjectRepository(Trazabilidad)
//     private trazabilidadRepository: Repository<Trazabilidad>,

//     @InjectRepository(Jefe)
//     private jefeRepository: Repository<Jefe>,
//   ) { }

//   async getEjecutivas() {
//     const ejecutivas = await this.ejecutivaRepository.find({
//       relations: ['empresa_proveedora'],
//       order: { estado_ejecutiva: 'DESC', nombre_completo: 'ASC' }
//     });

//     // Enriquecer con estadísticas
//     const ejecutivasConStats = await Promise.all(
//       ejecutivas.map(async (ejecutiva) => {
//         const [totalClientes, totalActividades] = await Promise.all([
//           this.clienteRepository.count({
//             where: { ejecutiva: { id_ejecutiva: ejecutiva.id_ejecutiva } }
//           }),
//           this.trazabilidadRepository.count({
//             where: { ejecutiva: { id_ejecutiva: ejecutiva.id_ejecutiva } }
//           })
//         ]);

//         return {
//           ...ejecutiva,
//           total_clientes: totalClientes,
//           total_actividades: totalActividades,
//           empresa_asignada: ejecutiva.empresa_proveedora ? ejecutiva.empresa_proveedora.razon_social : 'Sin asignar'
//         };
//       })
//     );

//     return ejecutivasConStats;
//   }

//   async getEjecutivaById(id: number) {
//     const ejecutiva = await this.ejecutivaRepository.findOne({
//       where: { id_ejecutiva: id },
//       relations: ['empresa_proveedora', 'clientes_finales']
//     });

//     if (!ejecutiva) {
//       return null;
//     }

//     // Obtener estadísticas adicionales
//     const [totalActividades, actividadesRecientes] = await Promise.all([
//       this.trazabilidadRepository.count({
//         where: { ejecutiva: { id_ejecutiva: id } }
//       }),
//       this.trazabilidadRepository.find({
//         where: { ejecutiva: { id_ejecutiva: id } },
//         order: { fecha_contacto: 'DESC' },
//         take: 10,
//         relations: ['cliente_final', 'empresa_proveedora']
//       })
//     ]);

//     return {
//       ejecutiva,
//       estadisticas: {
//         total_clientes: ejecutiva.clientes_finales.length,
//         total_actividades: totalActividades,
//         actividades_recientes: actividadesRecientes
//       }
//     };
//   }

//   async createEjecutiva(data: any) {
//     console.log('📥 Datos recibidos en backend:', data);
//     const { dni, nombre_completo, correo, contraseña, telefono, id_jefe } = data;

//     console.log('🔍 Buscando jefe con ID:', id_jefe);

//     let jefeAsignar;

//     if (id_jefe) {
//       // Usar el id_jefe que viene del frontend
//       jefeAsignar = await this.jefeRepository.findOne({
//         where: { id_jefe: id_jefe }
//       });
//       console.log('✅ Jefe encontrado:', jefeAsignar);
//     }
//     if (!jefeAsignar) {
//       console.log('⚠️  No se encontró jefe específico, buscando primero disponible...');
//       jefeAsignar = await this.jefeRepository.findOne({
//         order: { id_jefe: 'ASC' }
//       });
//       console.log('✅ Primer jefe disponible:', jefeAsignar);
//     }

//     if (!jefeAsignar) {
//       console.error('❌ No hay jefes en el sistema');
//       throw new HttpException('No hay jefes disponibles en el sistema', HttpStatus.BAD_REQUEST);
//     }


//     // Verificar DNI único
//     const existingDni = await this.ejecutivaRepository.findOne({
//       where: { dni }
//     });

//     if (existingDni) {
//       throw new HttpException('Ya existe una ejecutiva con este DNI', HttpStatus.BAD_REQUEST);
//     }

//     // Verificar email único
//     const existingEmail = await this.ejecutivaRepository.findOne({
//       where: { correo }
//     });

//     if (existingEmail) {
//       throw new HttpException('Ya existe una ejecutiva con este email', HttpStatus.BAD_REQUEST);
//     }

//     // Hashear contraseña
//     const bcrypt = require('bcryptjs');
//     const hashedPassword = await bcrypt.hash(contraseña, 10);

//     const nuevaEjecutiva = this.ejecutivaRepository.create({
//       dni,
//       nombre_completo,
//       correo,
//       contraseña: hashedPassword,
//       telefono: telefono || null,
//       estado_ejecutiva: 'Activo',
//       jefe: jefeAsignar,

//     });
//     console.log('Nueva Ejecutiva:', nuevaEjecutiva, 'Jefe asignado:', jefeAsignar);
//     return await this.ejecutivaRepository.save(nuevaEjecutiva);
//   }

//   async updateEjecutiva(id: number, data: any) {
//     const ejecutiva = await this.ejecutivaRepository.findOne({
//       where: { id_ejecutiva: id }
//     });

//     if (!ejecutiva) {
//       return null;
//     }

//     // Actualizar campos
//     if (data.nombre_completo) ejecutiva.nombre_completo = data.nombre_completo;
//     if (data.telefono !== undefined) ejecutiva.telefono = data.telefono;
//     if (data.linkedin !== undefined) ejecutiva.linkedin = data.linkedin;
//     if (data.estado_ejecutiva) ejecutiva.estado_ejecutiva = data.estado_ejecutiva;

//     ejecutiva.fecha_actualizacion = new Date();

//     return await this.ejecutivaRepository.save(ejecutiva);
//   }

//   async deleteEjecutiva(id: number) {
//     const ejecutiva = await this.ejecutivaRepository.findOne({
//       where: { id_ejecutiva: id }
//     });

//     if (!ejecutiva) {
//       return null;
//     }

//     ejecutiva.estado_ejecutiva = 'Inactivo';
//     ejecutiva.fecha_actualizacion = new Date();

//     return await this.ejecutivaRepository.save(ejecutiva);
//   }
// }

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';
import { Jefe } from 'shared/entities/Jefe.entity';


@Injectable()
export class EjecutivasService {
  constructor(
    @InjectRepository(Ejecutiva)
    private ejecutivaRepository: Repository<Ejecutiva>,

    @InjectRepository(EmpresaProveedora)
    private empresaRepository: Repository<EmpresaProveedora>,

    @InjectRepository(ClienteFinal)
    private clienteRepository: Repository<ClienteFinal>,

    @InjectRepository(Trazabilidad)
    private trazabilidadRepository: Repository<Trazabilidad>,

    @InjectRepository(Jefe)
    private jefeRepository: Repository<Jefe>,
  ) { }

  async getEjecutivas() {
    const ejecutivas = await this.ejecutivaRepository.find({
      relations: ['empresa_proveedora'],
      order: { estado_ejecutiva: 'DESC', nombre_completo: 'ASC' }
    });

    // Enriquecer con estadísticas
    const ejecutivasConStats = await Promise.all(
      ejecutivas.map(async (ejecutiva) => {
        const [totalClientes, totalActividades] = await Promise.all([
          this.clienteRepository.count({
            where: { ejecutiva: { id_ejecutiva: ejecutiva.id_ejecutiva } }
          }),
          this.trazabilidadRepository.count({
            where: { ejecutiva: { id_ejecutiva: ejecutiva.id_ejecutiva } }
          })
        ]);

        return {
          ...ejecutiva,
          total_clientes: totalClientes,
          total_actividades: totalActividades,
          empresa_asignada: ejecutiva.empresa_proveedora ? ejecutiva.empresa_proveedora.razon_social : 'Sin asignar'
        };
      })
    );

    return ejecutivasConStats;
  }

  async getEjecutivaById(id: number) {
    const ejecutiva = await this.ejecutivaRepository.findOne({
      where: { id_ejecutiva: id },
      relations: ['empresa_proveedora', 'clientes_finales', 'clientes_finales.empresa_proveedora'] // ✅ Agregar relaciones
    });

    if (!ejecutiva) {
      return null;
    }

    // Obtener estadísticas adicionales
    const [totalActividades, actividadesRecientes] = await Promise.all([
      this.trazabilidadRepository.count({
        where: { ejecutiva: { id_ejecutiva: id } }
      }),
      this.trazabilidadRepository.find({
        where: { ejecutiva: { id_ejecutiva: id } },
        order: { fecha_contacto: 'DESC' },
        take: 10,
        relations: ['cliente_final']
      })
    ]);

    // ✅ FORMATO CORRECTO: Empresas asociadas
    const empresasAsociadas = ejecutiva.empresa_proveedora ? [{
      id_empresa: ejecutiva.empresa_proveedora.id_empresa_prov,
      nombre_empresa: ejecutiva.empresa_proveedora.razon_social,
      rut: ejecutiva.empresa_proveedora.ruc,
      fecha_asignacion: ejecutiva.fecha_creacion, // O la fecha real de asignación si la tienes
      asignacion_activa: true
    }] : [];

    // ✅ FORMATO CORRECTO: Clientes asignados
    const clientesAsignados = ejecutiva.clientes_finales.map(cliente => ({
      id_cliente: cliente.id_cliente_final,
      nombre_cliente: cliente.razon_social,
      rut_cliente: cliente.ruc,
      email: cliente.correo,
      telefono: cliente.telefono,
      estado: cliente.estado || 'activo',
      nombre_empresa: cliente.empresa_proveedora?.razon_social || 'N/A',
      fecha_registro: cliente.fecha_creacion
    }));

    return {
      ejecutiva: {
        ...ejecutiva,
        empresa_asignada: ejecutiva.empresa_proveedora ? ejecutiva.empresa_proveedora.razon_social : 'Sin asignar',
        empresa_nombre: ejecutiva.empresa_proveedora ? ejecutiva.empresa_proveedora.razon_social : 'Sin asignar'
      },
      estadisticas: {
        total_clientes: ejecutiva.clientes_finales.length,
        total_actividades: totalActividades,
        actividades_recientes: actividadesRecientes
      },
      empresas: empresasAsociadas, // ✅ Lista de empresas
      clientes: clientesAsignados  // ✅ Lista de clientes
    };
  }

  async createEjecutiva(data: any) {
    console.log('📥 Datos recibidos en backend:', data);
    const { dni, nombre_completo, correo, contraseña, telefono, id_jefe } = data;

    console.log('🔍 Buscando jefe con ID:', id_jefe);

    let jefeAsignar;

    if (id_jefe) {
      // Usar el id_jefe que viene del frontend
      jefeAsignar = await this.jefeRepository.findOne({
        where: { id_jefe: id_jefe }
      });
      console.log('✅ Jefe encontrado:', jefeAsignar);
    }
    if (!jefeAsignar) {
      console.log('⚠️  No se encontró jefe específico, buscando primero disponible...');
      jefeAsignar = await this.jefeRepository.findOne({
        order: { id_jefe: 'ASC' }
      });
      console.log('✅ Primer jefe disponible:', jefeAsignar);
    }

    if (!jefeAsignar) {
      console.error('❌ No hay jefes en el sistema');
      throw new HttpException('No hay jefes disponibles en el sistema', HttpStatus.BAD_REQUEST);
    }


    // Verificar DNI único
    const existingDni = await this.ejecutivaRepository.findOne({
      where: { dni }
    });

    if (existingDni) {
      throw new HttpException('Ya existe una ejecutiva con este DNI', HttpStatus.BAD_REQUEST);
    }

    // Verificar email único
    const existingEmail = await this.ejecutivaRepository.findOne({
      where: { correo }
    });

    if (existingEmail) {
      throw new HttpException('Ya existe una ejecutiva con este email', HttpStatus.BAD_REQUEST);
    }

    // Hashear contraseña
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const nuevaEjecutiva = this.ejecutivaRepository.create({
      dni,
      nombre_completo,
      correo,
      contraseña: hashedPassword,
      telefono: telefono || null,
      estado_ejecutiva: 'Activo',
      jefe: jefeAsignar,

    });
    console.log('Nueva Ejecutiva:', nuevaEjecutiva, 'Jefe asignado:', jefeAsignar);
    return await this.ejecutivaRepository.save(nuevaEjecutiva);
  }

  async updateEjecutiva(id: number, data: any) {
    const ejecutiva = await this.ejecutivaRepository.findOne({
      where: { id_ejecutiva: id }
    });

    if (!ejecutiva) {
      return null;
    }

    // Actualizar campos
    if (data.nombre_completo) ejecutiva.nombre_completo = data.nombre_completo;
    if (data.telefono !== undefined) ejecutiva.telefono = data.telefono;
    if (data.linkedin !== undefined) ejecutiva.linkedin = data.linkedin;
    if (data.estado_ejecutiva) ejecutiva.estado_ejecutiva = data.estado_ejecutiva;

    ejecutiva.fecha_actualizacion = new Date();

    return await this.ejecutivaRepository.save(ejecutiva);
  }

  async deleteEjecutiva(id: number) {
    const ejecutiva = await this.ejecutivaRepository.findOne({
      where: { id_ejecutiva: id }
    });

    if (!ejecutiva) {
      return null;
    }

    ejecutiva.estado_ejecutiva = 'Inactivo';
    ejecutiva.fecha_actualizacion = new Date();

    return await this.ejecutivaRepository.save(ejecutiva);
  }

  // ✅ NUEVO: Obtener ejecutivas SIN empresa asignada
  // async getEjecutivasDisponibles() {
  //   console.log('🔍 [EjecutivasService] Buscando ejecutivas disponibles...');

  //   const ejecutivasDisponibles = await this.ejecutivaRepository.find({
  //     where: { 
  //       estado_ejecutiva: 'Activo',
  //       empresa_proveedora: IsNull() // ✅ Sin empresa asignada
  //     },
  //     relations: ['jefe'],
  //     order: { nombre_completo: 'ASC' }
  //   });

  //   console.log('✅ [EjecutivasService] Ejecutivas disponibles:', ejecutivasDisponibles.length);

  //   // ✅ Formatear para el frontend
  //   return ejecutivasDisponibles.map(ej => {
  //     const nombreParts = ej.nombre_completo.split(' ');
  //     return {
  //       id_usuario: ej.id_ejecutiva,
  //       nombre: nombreParts[0] || '',
  //       apellido: nombreParts.slice(1).join(' ') || '',
  //       email: ej.correo,
  //       telefono: ej.telefono,
  //       activo: ej.estado_ejecutiva === 'Activo',
  //       total_empresas: 0, // Siempre 0 porque no tienen empresa
  //       total_clientes: 0,
  //       total_actividades: 0
  //     };
  //   });
  // }
  // En EjecutivasService - método mejorado
  // async getEjecutivasDisponibles() {
  //   try {
  //     console.log('🔍 [EjecutivasService] Buscando ejecutivas disponibles...');

  //     const ejecutivasDisponibles = await this.ejecutivaRepository.find({
  //       where: {
  //         estado_ejecutiva: 'Activo',
  //         id_empresa_prov: IsNull() // ✅ Sin empresa asignada
  //       },
  //       relations: ['jefe'],
  //       order: { nombre_completo: 'ASC' }
  //     });

  //     console.log('✅ [EjecutivasService] Ejecutivas disponibles encontradas:', ejecutivasDisponibles.length);

  //     // ✅ Obtener estadísticas reales para cada ejecutiva
  //     const ejecutivasConStats = await Promise.all(
  //       ejecutivasDisponibles.map(async (ej) => {
  //         const [totalClientes, totalActividades] = await Promise.all([
  //           this.clienteRepository.count({
  //             where: { ejecutiva: { id_ejecutiva: ej.id_ejecutiva } }
  //           }),
  //           this.trazabilidadRepository.count({
  //             where: { ejecutiva: { id_ejecutiva: ej.id_ejecutiva } }
  //           })
  //         ]);

  //         const nombreParts = ej.nombre_completo.split(' ');
  //         return {
  //           id_usuario: ej.id_ejecutiva,
  //           nombre: nombreParts[0] || '',
  //           apellido: nombreParts.slice(1).join(' ') || '',
  //           email: ej.correo,
  //           telefono: ej.telefono,
  //           activo: ej.estado_ejecutiva === 'Activo',
  //           total_empresas: 0, // Siempre 0 porque no tienen empresa
  //           total_clientes: totalClientes,
  //           total_actividades: totalActividades,
  //           fecha_creacion: ej.fecha_creacion
  //         };
  //       })
  //     );

  //     return ejecutivasConStats;
  //   } catch (error) {
  //     console.error('❌ [EjecutivasService] Error obteniendo ejecutivas disponibles:', error);
  //   }
  // }

  // // En ejecutivas.service.ts - VERSIÓN MEJORADA
  // async getEjecutivasDisponibles() {
  //   try {
  //     console.log('🔍 [EjecutivasService] Buscando ejecutivas disponibles...');

  //     // ✅ FILTRAR EXPLÍCITAMENTE EJECUTIVAS VÁLIDAS
  //     const ejecutivasDisponibles = await this.ejecutivaRepository.find({
  //       where: {
  //         estado_ejecutiva: 'Activo',
  //         id_empresa_prov: IsNull()
  //       },
  //       relations: ['jefe'],
  //       order: { nombre_completo: 'ASC' }
  //     });

  //     console.log('✅ [EjecutivasService] Ejecutivas encontradas:', ejecutivasDisponibles.length);

  //     // ✅ FILTRAR SOLO EJECUTIVAS CON ID VÁLIDO
  //     const ejecutivasValidas = ejecutivasDisponibles.filter(
  //       ej => ej.id_ejecutiva !== null && ej.id_ejecutiva !== undefined
  //     );

  //     console.log('✅ [EjecutivasService] Ejecutivas válidas:', ejecutivasValidas.length);

  //     if (ejecutivasValidas.length === 0) {
  //       return [];
  //     }

  //     // ✅ OBTENER ESTADÍSTICAS SOLO PARA EJECUTIVAS VÁLIDAS
  //     const ejecutivasConStats = await Promise.all(
  //       ejecutivasValidas.map(async (ej) => {
  //         try {
  //           const [totalClientes, totalActividades] = await Promise.all([
  //             this.clienteRepository.count({
  //               where: { ejecutiva: { id_ejecutiva: ej.id_ejecutiva } }
  //             }),
  //             this.trazabilidadRepository.count({
  //               where: { ejecutiva: { id_ejecutiva: ej.id_ejecutiva } }
  //             })
  //           ]);

  //           const nombreParts = ej.nombre_completo?.split(' ') || ['Ejecutiva', ''];

  //           return {
  //             id_ejecutiva: ej.id_ejecutiva,
  //             id_usuario: ej.id_ejecutiva,
  //             dni: ej.dni,
  //             nombre_completo: ej.nombre_completo,
  //             nombre: nombreParts[0] || 'Ejecutiva',
  //             apellido: nombreParts.slice(1).join(' ') || '',
  //             correo: ej.correo,
  //             email: ej.correo,
  //             telefono: ej.telefono,
  //             linkedin: ej.linkedin,
  //             estado_ejecutiva: ej.estado_ejecutiva,
  //             activo: ej.estado_ejecutiva === 'Activo',
  //             total_empresas: 0,
  //             total_clientes: totalClientes || 0,
  //             total_actividades: totalActividades || 0,
  //             fecha_creacion: ej.fecha_creacion,
  //             fecha_actualizacion: ej.fecha_actualizacion
  //           };
  //         } catch (error) {
  //           console.error(`❌ Error procesando ejecutiva ${ej.id_ejecutiva}:`, error);
  //           return null;
  //         }
  //       })
  //     );

  //     // ✅ FILTRAR RESULTADOS NULOS
  //     const resultado = ejecutivasConStats.filter(ej => ej !== null);

  //     console.log('✅ [EjecutivasService] Resultado final:', resultado.length);
  //     return resultado;

  //   } catch (error) {
  //     console.error('❌ [EjecutivasService] Error crítico:', error);
  //     throw error;
  //   }
  // }

  async getEjecutivasDisponibles() {
    try {
      console.log('🔍 [EjecutivasService] Buscando ejecutivas disponibles...');

      // ✅ SOLUCIÓN: Usar consulta más simple y segura
      const query = `
      SELECT 
        e.id_ejecutiva,
        e.dni,
        e.nombre_completo,
        e.correo,
        e.telefono,
        e.linkedin,
        e.estado_ejecutiva,
        e.fecha_creacion,
        e.fecha_actualizacion,
        COUNT(DISTINCT cf.id_cliente_final) as total_clientes,
        COUNT(DISTINCT t.id_trazabilidad) as total_actividades
      FROM ejecutiva e
      LEFT JOIN cliente_final cf ON e.id_ejecutiva = cf.id_ejecutiva
      LEFT JOIN trazabilidad t ON e.id_ejecutiva = t.id_ejecutiva
      WHERE e.estado_ejecutiva = 'Activo' 
        AND e.id_empresa_prov IS NULL
      GROUP BY e.id_ejecutiva, e.dni, e.nombre_completo, e.correo, 
               e.telefono, e.linkedin, e.estado_ejecutiva,
               e.fecha_creacion, e.fecha_actualizacion
      ORDER BY e.nombre_completo ASC
    `;

      const ejecutivasDisponibles = await this.ejecutivaRepository.query(query);

      console.log('✅ [EjecutivasService] Ejecutivas disponibles encontradas:', ejecutivasDisponibles.length);

      // ✅ MAPEO SEGURO
      return ejecutivasDisponibles.map(ej => {
        const nombreParts = ej.nombre_completo?.split(' ') || ['Ejecutiva', ''];

        return {
          id_ejecutiva: ej.id_ejecutiva,
          id_usuario: ej.id_ejecutiva,
          dni: ej.dni,
          nombre_completo: ej.nombre_completo,
          nombre: nombreParts[0] || 'Ejecutiva',
          apellido: nombreParts.slice(1).join(' ') || '',
          correo: ej.correo,
          email: ej.correo,
          telefono: ej.telefono,
          linkedin: ej.linkedin,
          estado_ejecutiva: ej.estado_ejecutiva,
          activo: ej.estado_ejecutiva === 'Activo',
          total_empresas: 0,
          total_clientes: parseInt(ej.total_clientes) || 0,
          total_actividades: parseInt(ej.total_actividades) || 0,
          fecha_creacion: ej.fecha_creacion,
          fecha_actualizacion: ej.fecha_actualizacion
        };
      });

    } catch (error) {
      console.error('❌ [EjecutivasService] Error crítico:', error);

      // ✅ EN CASO DE ERROR, RETORNAR ARRAY VACÍO
      return [];
    }
  }

}