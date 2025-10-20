// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { sql, pool } from '../../../../../shared/utils/database';

// @Injectable()
// export class EmpresasService {
//   async getEmpresas() {
//     const result = await sql.query(`
//       SELECT 
//         ep.*,
//         COUNT(DISTINCT ee.id_ejecutiva)::int as total_ejecutivas,
//         COUNT(DISTINCT ce.id_cliente)::int as total_clientes
//       FROM public.empresa_proveedora ep
//       LEFT JOIN public.empresa_ejecutiva ee ON ep.id_empresa = ee.id_empresa AND ee.activo = true
//       LEFT JOIN public.cliente_empresa ce ON ep.id_empresa = ce.id_empresa
//       GROUP BY ep.id_empresa
//       ORDER BY ep.activo DESC, ep.nombre_empresa
//     `);
//     return result.rows;
//   }

//   async createEmpresa(data: any) {
//     const { nombre_empresa, rut, direccion, telefono, email_contacto } = data;

//     const result = await sql.query(
//       `INSERT INTO public.empresa_proveedora 
//        (nombre_empresa, rut, direccion, telefono, email_contacto)
//        VALUES ($1, $2, $3, $4, $5)
//        RETURNING *`,
//       [nombre_empresa, rut, direccion, telefono, email_contacto]
//     );

//     return result.rows[0];
//   }

//   async updateEmpresaEstado(empresaId: number, activo: boolean) {
//     await sql.query("BEGIN");

//     try {
//       const empresaResult = await sql.query(
//         `UPDATE public.empresa_proveedora
//          SET activo = $1
//          WHERE id_empresa = $2
//          RETURNING *`,
//         [activo, empresaId]
//       );

//       if (empresaResult.rows.length === 0) {
//         await sql.query("ROLLBACK");
//         throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
//       }

//       const clientesResult = await sql.query(
//         `UPDATE public.cliente_empresa
//          SET estado = $1
//          WHERE id_empresa = $2
//          RETURNING id_cliente`,
//         [activo ? "activo" : "inactivo", empresaId]
//       );

//       await sql.query("COMMIT");

//       return {
//         empresa: empresaResult.rows[0],
//         clientesActualizados: clientesResult.rows.length,
//         message: `Empresa ${activo ? "activada" : "desactivada"} correctamente. ${clientesResult.rows.length} cliente(s) actualizado(s).`,
//       };
//     } catch (error) {
//       await sql.query("ROLLBACK");
//       throw error;
//     }
//   }

//   async getEmpresaEjecutivas(empresaId: number) {
//     if (!empresaId || isNaN(empresaId)) {
//       throw new HttpException('ID de empresa inválido', HttpStatus.BAD_REQUEST);
//     }

//     const empresaResult = await sql.query(
//       `SELECT * FROM empresa_proveedora WHERE id_empresa = $1`,
//       [empresaId]
//     );

//     if (empresaResult.rows.length === 0) {
//       throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
//     }

//     const ejecutivasResult = await sql.query(
//       `SELECT 
//          ee.id_relacion,
//          ee.id_empresa,
//          ee.id_ejecutiva AS id_usuario,
//          u.nombre,
//          u.apellido,
//          u.email,
//          ee.fecha_asignacion,
//          ee.fecha_desasignacion,
//          ee.activo
//        FROM empresa_ejecutiva ee
//        LEFT JOIN usuarios u ON ee.id_ejecutiva = u.id_usuario
//        WHERE ee.id_empresa = $1 AND ee.activo = true
//        ORDER BY u.nombre`,
//       [empresaId]
//     );

//     return {
//       ...empresaResult.rows[0],
//       ejecutivas: ejecutivasResult.rows || [],
//     };
//   }

//   async addEjecutivaToEmpresa(empresaId: number, ejecutivaId: number) {
//     if (!empresaId || !ejecutivaId) {
//       throw new HttpException('ID de empresa o ejecutiva inválido', HttpStatus.BAD_REQUEST);
//     }

//     const existing = await sql.query(
//       `SELECT * FROM empresa_ejecutiva WHERE id_empresa = $1 AND id_ejecutiva = $2`,
//       [empresaId, ejecutivaId]
//     );

//     if (existing.rows.length > 0) {
//       if (existing.rows[0].activo) {
//         throw new HttpException('Esta ejecutiva ya está asignada', HttpStatus.BAD_REQUEST);
//       } else {
//         const result = await sql.query(
//           `UPDATE empresa_ejecutiva
//            SET activo = true, fecha_asignacion = NOW(), fecha_desasignacion = NULL
//            WHERE id_empresa = $1 AND id_ejecutiva = $2
//            RETURNING *`,
//           [empresaId, ejecutivaId]
//         );
//         return result.rows[0];
//       }
//     }

//     const result = await sql.query(
//       `INSERT INTO empresa_ejecutiva (id_empresa, id_ejecutiva, fecha_asignacion, activo)
//        VALUES ($1, $2, NOW(), true)
//        RETURNING *`,
//       [empresaId, ejecutivaId]
//     );

//     return result.rows[0] || {};
//   }

//   async removeEjecutivaFromEmpresa(empresaId: number, ejecutivaId: number) {
//     if (!empresaId || !ejecutivaId) {
//       throw new HttpException('ID de empresa o ejecutiva inválido', HttpStatus.BAD_REQUEST);
//     }

//     const client = await pool.connect();

//     const result = await client.query(
//       `UPDATE empresa_ejecutiva
//        SET activo = false, fecha_desasignacion = NOW()
//        WHERE id_empresa = $1 AND id_ejecutiva = $2 AND activo = true`,
//       [empresaId, ejecutivaId]
//     );

//     client.release();

//     if (result.rowCount === 0) {
//       throw new HttpException('No se encontró la relación activa entre la empresa y la ejecutiva', HttpStatus.NOT_FOUND);
//     }

//     return { message: "Ejecutiva removida correctamente" };
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

  // async createEmpresa(data: any) {
  //   const { ruc, razon_social, correo, contraseña, telefono, pagina_web, rubro } = data;

  //   // Verificar RUC único
  //   const existingEmpresa = await this.empresaRepository.findOne({
  //     where: { ruc }
  //   });

  //   if (existingEmpresa) {
  //     throw new HttpException('Ya existe una empresa con este RUC', HttpStatus.BAD_REQUEST);
  //   }

  //   // Verificar email único
  //   const existingEmail = await this.empresaRepository.findOne({
  //     where: { correo }
  //   });

  //   if (existingEmail) {
  //     throw new HttpException('Ya existe una empresa con este email', HttpStatus.BAD_REQUEST);
  //   }

  //   // Hashear contraseña
  //   const bcrypt = require('bcryptjs');
  //   const hashedPassword = await bcrypt.hash(contraseña, 10);

  //   const nuevaEmpresa = this.empresaRepository.create({
  //     ruc,
  //     razon_social,
  //     correo,
  //     contraseña: hashedPassword,
  //     telefono: telefono || null,
  //     pagina_web: pagina_web || null,
  //     rubro: rubro || null,
  //     estado: 'Activo'
  //   });

  //   return await this.empresaRepository.save(nuevaEmpresa);
  // }

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

  async updateEmpresaEstado(empresaId: number, activo: boolean) {
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa_prov: empresaId }
    });

    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }

    empresa.estado = activo ? 'Activo' : 'Inactivo';
    empresa.fecha_actualizacion = new Date();

    // Si se desactiva la empresa, desactivar también sus ejecutivas
    if (!activo) {
      await this.ejecutivaRepository.update(
        { empresa_proveedora: { id_empresa_prov: empresaId } },
        { estado_ejecutiva: 'Inactivo' }
      );
    }

    await this.empresaRepository.save(empresa);

    return {
      empresa,
      message: `Empresa ${activo ? 'activada' : 'desactivada'} correctamente`
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
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa_prov: empresaId },
      relations: ['ejecutivas']
    });

    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }

    // Enriquecer ejecutivas con estadísticas
    const ejecutivasConStats = await Promise.all(
      empresa.ejecutivas.map(async (ejecutiva) => {
        const totalClientes = await this.clienteRepository.count({
          where: { ejecutiva: { id_ejecutiva: ejecutiva.id_ejecutiva } }
        });

        return {
          ...ejecutiva,
          total_clientes: totalClientes
        };
      })
    );

    return {
      ...empresa,
      ejecutivas: ejecutivasConStats
    };
  }

  async addEjecutivaToEmpresa(empresaId: number, ejecutivaId: number) {
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa_prov: empresaId }
    });

    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }

    const ejecutiva = await this.ejecutivaRepository.findOne({
      where: { id_ejecutiva: ejecutivaId }
    });

    if (!ejecutiva) {
      throw new HttpException('Ejecutiva no encontrada', HttpStatus.NOT_FOUND);
    }

    // Verificar si ya está asignada
    if (ejecutiva.empresa_proveedora && ejecutiva.empresa_proveedora.id_empresa_prov === empresaId) {
      throw new HttpException('Esta ejecutiva ya está asignada a esta empresa', HttpStatus.BAD_REQUEST);
    }

    // Asignar ejecutiva a la empresa
    ejecutiva.empresa_proveedora = empresa;
    ejecutiva.fecha_actualizacion = new Date();

    await this.ejecutivaRepository.save(ejecutiva);

    return {
      message: 'Ejecutiva asignada correctamente a la empresa',
      ejecutiva: {
        id_ejecutiva: ejecutiva.id_ejecutiva,
        nombre_completo: ejecutiva.nombre_completo,
        correo: ejecutiva.correo
      }
    };
  }

  async removeEjecutivaFromEmpresa(empresaId: number, ejecutivaId: number) {
    const ejecutiva = await this.ejecutivaRepository.findOne({
      where: {
        id_ejecutiva: ejecutivaId,
        empresa_proveedora: { id_empresa_prov: empresaId }
      },
      relations: ['empresa_proveedora']
    });

    if (!ejecutiva) {
      throw new HttpException('Ejecutiva no encontrada en esta empresa', HttpStatus.NOT_FOUND);
    }

    // Remover asignación
    ejecutiva.empresa_proveedora = null;
    ejecutiva.fecha_actualizacion = new Date();

    await this.ejecutivaRepository.save(ejecutiva);

    return { message: 'Ejecutiva removida correctamente de la empresa' };
  }
}