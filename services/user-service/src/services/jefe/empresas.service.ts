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

  // ✅ USAR TRANSACCIÓN para atomicidad
  const queryRunner = this.empresaRepository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // ✅ 1. OBTENER EMPRESA
    const empresa = await queryRunner.manager.findOne(EmpresaProveedora, {
      where: { id_empresa_prov: empresaId }
    });

    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }

    const estadoAnterior = empresa.estado;
    const nuevoEstado = activo ? 'Activo' : 'Inactivo';

    // ✅ 2. OBTENER EJECUTIVAS DE ESTA EMPRESA (forma más simple)
    const ejecutivasEmpresa = await queryRunner.manager.find(Ejecutiva, {
      where: { id_empresa_prov: empresaId }
    });

    const idsEjecutivas = ejecutivasEmpresa.map(ej => ej.id_ejecutiva);

    // ✅ 3. ACTUALIZAR CLIENTES (si hay ejecutivas)
    if (idsEjecutivas.length > 0) {
      
      const nuevoEstadoCliente = activo ? 'Activo' : 'Inactivo';
      
      // ✅ FORMA MÁS SEGURA: Actualizar cliente por cliente
      for (const idEjecutiva of idsEjecutivas) {
        const result = await queryRunner.manager.update(
          ClienteFinal,
          { ejecutiva: { id_ejecutiva: idEjecutiva } },
          { 
            estado: nuevoEstadoCliente,
            fecha_actualizacion: new Date()
          }
        );
      }
    }

    // ✅ 4. ACTUALIZAR EMPRESA
    await queryRunner.manager.update(
      EmpresaProveedora,
      { id_empresa_prov: empresaId },
      { 
        estado: nuevoEstado,
        fecha_actualizacion: new Date()
      }
    );

    // ✅ 5. CONFIRMAR TRANSACCIÓN
    await queryRunner.commitTransaction();

    return {
      empresa: { ...empresa, estado: nuevoEstado },
      message: `Empresa ${activo ? 'activada' : 'desactivada'} correctamente. ` +
        `${idsEjecutivas.length > 0 ? `${idsEjecutivas.length} cliente(s) ${activo ? 'activado(s)' : 'desactivado(s)'}.` : 'No hay clientes asociados.'}`
    };

  } catch (error) {
    // ✅ 6. REVERTIR EN CASO DE ERROR
    await queryRunner.rollbackTransaction();

    throw new HttpException(
      'Error al cambiar estado. Los cambios han sido revertidos.',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  } finally {
    // ✅ 7. LIBERAR RECURSOS
    await queryRunner.release();
  }
}

  // En EmpresasService.ts - agregar este método
  async updateEmpresa(empresaId: number, data: any) {

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
      return empresaActualizada;
    } catch (error) {
      throw new HttpException(
        'Error interno del servidor al actualizar empresa',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getEmpresaEjecutivas(empresaId: number) {

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

  // En empresas.service.ts (puerto 3002)
  async asignarEjecutivaAEmpresa(idEmpresa: number, idEjecutiva: number) {
    try {

      // Verificar que la empresa existe
      const empresa = await this.empresaRepository.findOne({
        where: { id_empresa_prov: idEmpresa }
      });

      if (!empresa) {
        throw new Error('Empresa no encontrada');
      }

      // Verificar que la ejecutiva existe y está disponible
      const ejecutiva = await this.ejecutivaRepository.findOne({
        where: {
          id_ejecutiva: idEjecutiva,
          estado_ejecutiva: 'Activo'
        }
      });

      if (!ejecutiva) {
        throw new Error('Ejecutiva no encontrada o no disponible');
      }

      // Asignar la ejecutiva a la empresa
      ejecutiva.id_empresa_prov = idEmpresa;
      await this.ejecutivaRepository.save(ejecutiva);

      return {
        success: true,
        message: 'Ejecutiva asignada correctamente',
        empresa: empresa.razon_social,
        ejecutiva: ejecutiva.nombre_completo
      };

    } catch (error) {
      throw new Error(error.message || 'Error al asignar ejecutiva');
    }
  }
  // En EmpresasService.ts - AGREGAR ESTE MÉTODO NUEVO
    async getEjecutivasDisponibles() {

      // ✅ CONSULTA CORREGIDA - Usar QueryBuilder con LEFT JOIN
      const ejecutivasDisponibles = await this.ejecutivaRepository
        .createQueryBuilder('ejecutiva')
        .leftJoinAndSelect('ejecutiva.empresa_proveedora', 'empresa')
        .where('ejecutiva.estado_ejecutiva = :estado', { estado: 'Activo' })
        .andWhere('empresa.id_empresa_prov IS NULL') // ← Ejecutivas SIN empresa
        .orderBy('ejecutiva.nombre_completo', 'ASC')
        .getMany();


      // ✅ Formatear para el frontend
      const ejecutivasFormateadas = ejecutivasDisponibles.map(ejecutiva => ({
        id_ejecutiva: ejecutiva.id_ejecutiva,
        id_usuario: ejecutiva.id_ejecutiva,
        nombre_completo: ejecutiva.nombre_completo,
        nombre: ejecutiva.nombre_completo?.split(' ')[0] || '',
        apellido: ejecutiva.nombre_completo?.split(' ').slice(1).join(' ') || '',
        correo: ejecutiva.correo,
        email: ejecutiva.correo,
        telefono: ejecutiva.telefono,
        dni: ejecutiva.dni,
        estado_ejecutiva: ejecutiva.estado_ejecutiva,
        activo: ejecutiva.estado_ejecutiva === 'Activo',
        rol: 'ejecutiva'
      }));

      return ejecutivasFormateadas;
  }

  // En EmpresasService.ts - REVISAR Y CORREGIR
async addEjecutivaToEmpresa(empresaId: number, ejecutivaId: number) {

  try {
    // ✅ Verificar que la empresa existe
    const empresa = await this.empresaRepository.findOne({
      where: { id_empresa_prov: empresaId }
    });

    if (!empresa) {
      throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
    }

    // ✅ Verificar que la ejecutiva existe y está activa
    const ejecutiva = await this.ejecutivaRepository.findOne({
      where: { 
        id_ejecutiva: ejecutivaId,
        estado_ejecutiva: 'Activo'
      },
      relations: ['empresa_proveedora'] // ✅ Mantener relations para verificar
    });

    if (!ejecutiva) {
      throw new HttpException('Ejecutiva no encontrada o inactiva', HttpStatus.NOT_FOUND);
    }

    // ✅ Verificar si ya está asignada a ESTA empresa
    if (ejecutiva.empresa_proveedora?.id_empresa_prov === empresaId) {
      throw new HttpException('Esta ejecutiva ya está asignada a esta empresa', HttpStatus.BAD_REQUEST);
    }

    // ✅ Verificar si está asignada a OTRA empresa
    if (ejecutiva.empresa_proveedora && ejecutiva.empresa_proveedora.id_empresa_prov !== empresaId) {
      throw new HttpException(
        `La ejecutiva ya está asignada a: ${ejecutiva.empresa_proveedora.razon_social}`,
        HttpStatus.BAD_REQUEST
      );
    }

    // ✅ ASIGNAR ejecutiva a la empresa
    ejecutiva.empresa_proveedora = empresa;
    ejecutiva.fecha_actualizacion = new Date();

    // ✅ Guardar usando save (para que funcione el trigger de auditoría)
    await this.ejecutivaRepository.save(ejecutiva);

    return {
      success: true,
      message: 'Ejecutiva asignada correctamente a la empresa',
      ejecutiva: {
        id_ejecutiva: ejecutiva.id_ejecutiva,
        nombre_completo: ejecutiva.nombre_completo,
        correo: ejecutiva.correo
      }
    };

  } catch (error) {
    
    if (error instanceof HttpException) {
      throw error;
    }
    
    throw new HttpException(
      'Error interno al asignar ejecutiva',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
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