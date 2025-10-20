// import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
// import { sql } from '../../../../../shared/utils/database';
// import * as bcrypt from 'bcryptjs';

// @Injectable()
// export class ClientesService {
//   async getClientes() {
//     const result = await sql.query(`
//       SELECT 
//         ce.id_cliente,
//         u_cliente.nombre AS nombre_cliente,
//         u_cliente.apellido AS apellido_cliente,
//         ce.rut_cliente,
//         ce.email,
//         ce.telefono,
//         ce.direccion,
//         ce.estado,
//         ce.id_empresa,
//         ce.id_ejecutiva,
//         ep.nombre_empresa,
//         COALESCE(u_ejecutiva.nombre || ' ' || u_ejecutiva.apellido, 'Sin asignar') AS ejecutiva_nombre,
//         COUNT(t.id_trazabilidad) AS total_actividades
//       FROM public.cliente_empresa ce
//       JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
//       LEFT JOIN public.usuarios u_cliente ON ce.id_usuario_cliente = u_cliente.id_usuario
//       LEFT JOIN public.usuarios u_ejecutiva ON ce.id_ejecutiva = u_ejecutiva.id_usuario
//       LEFT JOIN public.trazabilidad t ON ce.id_cliente = t.id_cliente
//       GROUP BY ce.id_cliente, u_cliente.nombre, u_cliente.apellido, ce.rut_cliente, ce.email, ce.telefono,
//                ce.direccion, ce.estado, ce.id_empresa, ce.id_ejecutiva, ep.nombre_empresa,
//                u_ejecutiva.nombre, u_ejecutiva.apellido
//       ORDER BY CASE WHEN ce.estado = 'activo' THEN 0 ELSE 1 END, u_cliente.nombre
//     `);
//     return result.rows;
//   }

//   async getClienteById(id: number) {
//     const result = await sql.query(
//       `SELECT 
//         ce.id_cliente,
//         ce.nombre_cliente,
//         ce.rut_cliente,
//         ce.email,
//         ce.telefono,
//         ce.direccion,
//         ce.estado,
//         ce.id_empresa,
//         ce.id_ejecutiva,
//         ce.id_usuario_cliente,
//         ep.nombre_empresa,
//         COALESCE(u.nombre || ' ' || u.apellido, 'Sin asignar') AS ejecutiva_nombre,
//         COUNT(t.id_trazabilidad) AS total_actividades
//       FROM public.cliente_empresa ce
//       JOIN public.empresa_proveedora ep ON ce.id_empresa = ep.id_empresa
//       LEFT JOIN public.usuarios u ON ce.id_ejecutiva = u.id_usuario
//       LEFT JOIN public.trazabilidad t ON ce.id_cliente = t.id_cliente
//       WHERE ce.id_cliente = $1
//       GROUP BY ce.id_cliente, ce.nombre_cliente, ce.rut_cliente, ce.email, ce.telefono, 
//                ce.direccion, ce.estado, ce.id_empresa, 
//                ce.id_ejecutiva, ce.id_usuario_cliente, ep.nombre_empresa, u.nombre, u.apellido`,
//       [id]
//     );

//     if (result.rows.length === 0) {
//       return null;
//     }

//     return result.rows[0];
//   }

//   async createCliente(data: any) {
//     const {
//       nombre_cliente,
//       apellido_cliente,
//       rut_cliente,
//       email_cliente,
//       password,
//       telefono_cliente,
//       direccion_cliente,
//       id_empresa,
//       id_ejecutiva,
//     } = data;

//     if (!nombre_cliente || !apellido_cliente || !rut_cliente || !email_cliente || !password || !id_empresa) {
//       throw new HttpException(
//         "Nombre, apellido, RUT, email, contraseña y empresa son campos requeridos",
//         HttpStatus.BAD_REQUEST
//       );
//     }

//     const existingRut = await sql.query("SELECT id_cliente FROM public.cliente_empresa WHERE rut_cliente = $1", [
//       rut_cliente,
//     ]);
//     if (existingRut.rows.length > 0) {
//       throw new HttpException("Ya existe un cliente con este RUT", HttpStatus.BAD_REQUEST);
//     }

//     const existingEmail = await sql.query("SELECT id_usuario FROM public.usuarios WHERE email = $1", [email_cliente]);
//     if (existingEmail.rows.length > 0) {
//       throw new HttpException("Ya existe un usuario con este email", HttpStatus.BAD_REQUEST);
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userResult = await sql.query(
//       `INSERT INTO public.usuarios (nombre, apellido, email, password_hash, rol, activo)
//        VALUES ($1, $2, $3, $4, 'cliente', true) RETURNING id_usuario`,
//       [nombre_cliente, apellido_cliente, email_cliente, hashedPassword]
//     );
//     const id_usuario_cliente = userResult.rows[0].id_usuario;

//     const result = await sql.query(
//       `INSERT INTO public.cliente_empresa 
//        (nombre_cliente, rut_cliente, email, telefono, direccion, id_empresa, id_ejecutiva, id_usuario_cliente, estado)
//        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'activo') RETURNING *`,
//       [
//         `${nombre_cliente} ${apellido_cliente}`,
//         rut_cliente,
//         email_cliente,
//         telefono_cliente || null,
//         direccion_cliente || null,
//         Number.parseInt(id_empresa),
//         id_ejecutiva && id_ejecutiva !== "0" ? Number.parseInt(id_ejecutiva) : null,
//         id_usuario_cliente,
//       ]
//     );

//     return result.rows[0];
//   }

//   async updateCliente(id: number, data: any) {
//     const { nombre_cliente, rut_cliente, email, telefono, direccion, id_empresa, id_ejecutiva, estado, password } = data;

//     const clienteResult = await sql.query(
//       "SELECT id_usuario_cliente FROM public.cliente_empresa WHERE id_cliente = $1",
//       [id]
//     );

//     if (clienteResult.rows.length === 0) {
//       throw new HttpException("Cliente no encontrado", HttpStatus.NOT_FOUND);
//     }

//     const id_usuario_cliente = clienteResult.rows[0].id_usuario_cliente;

//     if (rut_cliente) {
//       const existingRut = await sql.query(
//         "SELECT id_cliente FROM public.cliente_empresa WHERE rut_cliente = $1 AND id_cliente != $2",
//         [rut_cliente, id]
//       );
//       if (existingRut.rows.length > 0) {
//         throw new HttpException("Ya existe otro cliente con este RUT", HttpStatus.BAD_REQUEST);
//       }
//     }

//     if (email) {
//       const existingClient = await sql.query(
//         "SELECT id_cliente FROM public.cliente_empresa WHERE email = $1 AND id_cliente != $2",
//         [email, id]
//       );
//       if (existingClient.rows.length > 0) {
//         throw new HttpException("Ya existe otro cliente con este email", HttpStatus.BAD_REQUEST);
//       }
//     }

//     if (password && password.trim() !== "") {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       await sql.query("UPDATE public.usuarios SET password_hash = $1 WHERE id_usuario = $2", [
//         hashedPassword,
//         id_usuario_cliente,
//       ]);
//     }

//     if (email) {
//       await sql.query("UPDATE public.usuarios SET email = $1 WHERE id_usuario = $2", [email, id_usuario_cliente]);
//     }

//     const result = await sql.query(
//       `UPDATE public.cliente_empresa 
//        SET nombre_cliente = COALESCE($1, nombre_cliente),
//            rut_cliente = COALESCE($2, rut_cliente),
//            email = COALESCE($3, email),
//            telefono = COALESCE($4, telefono),
//            direccion = COALESCE($5, direccion),
//            id_empresa = COALESCE($6, id_empresa),
//            id_ejecutiva = COALESCE($7, id_ejecutiva),
//            estado = COALESCE($8, estado)
//        WHERE id_cliente = $9
//        RETURNING *`,
//       [nombre_cliente, rut_cliente, email, telefono, direccion, id_empresa, id_ejecutiva, estado, id]
//     );

//     if (result.rows.length === 0) {
//       throw new HttpException("Cliente no encontrado", HttpStatus.NOT_FOUND);
//     }

//     return result.rows[0];
//   }

//   async deleteCliente(id: number) {
//     const result = await sql.query(
//       "UPDATE public.cliente_empresa SET estado = 'inactivo' WHERE id_cliente = $1 RETURNING *",
//       [id]
//     );

//     if (result.rows.length === 0) {
//       throw new HttpException("Cliente no encontrado", HttpStatus.NOT_FOUND);
//     }

//     return result.rows[0];
//   }
// }


import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteFinal } from '../../../../../shared/entities/ClienteFinal.entity';
import { Ejecutiva } from '../../../../../shared/entities/Ejecutiva.entity';
import { EmpresaProveedora } from '../../../../../shared/entities/EmpresaProveedora.entity';
import { PersonaContacto } from '../../../../../shared/entities/PersonaContacto.entity';
import { Trazabilidad } from '../../../../../shared/entities/Trazabilidad.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(ClienteFinal)
    private clienteRepository: Repository<ClienteFinal>,
    
    @InjectRepository(Ejecutiva)
    private ejecutivaRepository: Repository<Ejecutiva>,
    
    @InjectRepository(EmpresaProveedora)
    private empresaRepository: Repository<EmpresaProveedora>,
    
    @InjectRepository(PersonaContacto)
    private contactoRepository: Repository<PersonaContacto>,
    
    @InjectRepository(Trazabilidad)
    private trazabilidadRepository: Repository<Trazabilidad>,
  ) {}

  async getClientes() {
    const clientes = await this.clienteRepository.find({
      relations: ['ejecutiva', 'ejecutiva.empresa_proveedora', 'personas_contacto'],
      order: { fecha_creacion: 'DESC' }
    });

    // Enriquecer con estadísticas
    const clientesConStats = await Promise.all(
      clientes.map(async (cliente) => {
        const totalActividades = await this.trazabilidadRepository.count({
          where: { cliente_final: { id_cliente_final: cliente.id_cliente_final } }
        });

        const ultimaActividad = await this.trazabilidadRepository.findOne({
          where: { cliente_final: { id_cliente_final: cliente.id_cliente_final } },
          order: { fecha_contacto: 'DESC' }
        });

        return {
          ...cliente,
          total_actividades: totalActividades,
          ultima_actividad: ultimaActividad?.fecha_contacto || null,
          ejecutiva_asignada: cliente.ejecutiva ? cliente.ejecutiva.nombre_completo : 'Sin asignar',
          empresa_proveedora: cliente.ejecutiva?.empresa_proveedora?.razon_social || 'Sin empresa'
        };
      })
    );

    return clientesConStats;
  }

  async getClienteById(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { id_cliente_final: id },
      relations: [
        'ejecutiva', 
        'ejecutiva.empresa_proveedora', 
        'personas_contacto',
        'trazabilidades',
        'trazabilidades.persona_contacto',
        'trazabilidades.ejecutiva'
      ]
    });

    if (!cliente) {
      return null;
    }

    // Obtener estadísticas adicionales
    const actividadesRecientes = await this.trazabilidadRepository.find({
      where: { cliente_final: { id_cliente_final: id } },
      relations: ['persona_contacto', 'ejecutiva'],
      order: { fecha_contacto: 'DESC' },
      take: 20
    });

    return {
      cliente,
      actividades_recientes: actividadesRecientes,
      total_actividades: actividadesRecientes.length,
      personas_contacto: cliente.personas_contacto
    };
  }

  async createCliente(data: any) {
    const { 
      ruc, 
      razon_social, 
      correo, 
      telefono, 
      direccion, 
      id_ejecutiva,
      persona_contacto 
    } = data;

    // Verificar RUC único
    if (ruc) {
      const existingCliente = await this.clienteRepository.findOne({
        where: { ruc }
      });

      if (existingCliente) {
        throw new HttpException('Ya existe un cliente con este RUC', HttpStatus.BAD_REQUEST);
      }
    }

    // Verificar ejecutiva existe
    let ejecutiva = null;
    if (id_ejecutiva) {
      ejecutiva = await this.ejecutivaRepository.findOne({
        where: { id_ejecutiva: id_ejecutiva }
      });

      if (!ejecutiva) {
        throw new HttpException('Ejecutiva no encontrada', HttpStatus.BAD_REQUEST);
      }
    }

    const nuevoCliente = this.clienteRepository.create({
      ruc: ruc || null,
      razon_social,
      correo: correo || null,
      telefono: telefono || null,
      direccion: direccion || null,
      ejecutiva: ejecutiva,
      pais: 'Perú' // Por defecto
    });

    const clienteGuardado = await this.clienteRepository.save(nuevoCliente);

    // Crear persona de contacto si se proporciona
    if (persona_contacto && persona_contacto.nombre_completo) {
      const nuevoContacto = this.contactoRepository.create({
        nombre_completo: persona_contacto.nombre_completo,
        cargo: persona_contacto.cargo || null,
        correo: persona_contacto.correo || null,
        telefono: persona_contacto.telefono || null,
        cliente_final: clienteGuardado
      });

      await this.contactoRepository.save(nuevoContacto);
    }

    return await this.clienteRepository.findOne({
      where: { id_cliente_final: clienteGuardado.id_cliente_final },
      relations: ['ejecutiva', 'personas_contacto']
    });
  }

  async updateCliente(id: number, data: any) {
    const cliente = await this.clienteRepository.findOne({
      where: { id_cliente_final: id }
    });

    if (!cliente) {
      throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
    }

    // Verificar RUC único si se está actualizando
    if (data.ruc && data.ruc !== cliente.ruc) {
      const existingCliente = await this.clienteRepository.findOne({
        where: { ruc: data.ruc }
      });

      if (existingCliente) {
        throw new HttpException('Ya existe otro cliente con este RUC', HttpStatus.BAD_REQUEST);
      }
    }

    // Actualizar ejecutiva si se proporciona
    if (data.id_ejecutiva) {
      const ejecutiva = await this.ejecutivaRepository.findOne({
        where: { id_ejecutiva: data.id_ejecutiva }
      });

      if (!ejecutiva) {
        throw new HttpException('Ejecutiva no encontrada', HttpStatus.BAD_REQUEST);
      }

      cliente.ejecutiva = ejecutiva;
    }

    // Actualizar otros campos
    if (data.razon_social) cliente.razon_social = data.razon_social;
    if (data.ruc !== undefined) cliente.ruc = data.ruc;
    if (data.correo !== undefined) cliente.correo = data.correo;
    if (data.telefono !== undefined) cliente.telefono = data.telefono;
    if (data.direccion !== undefined) cliente.direccion = data.direccion;
    if (data.rubro !== undefined) cliente.rubro = data.rubro;
    if (data.sub_rubro !== undefined) cliente.sub_rubro = data.sub_rubro;
    
    cliente.fecha_actualizacion = new Date();

    return await this.clienteRepository.save(cliente);
  }

  async deleteCliente(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { id_cliente_final: id }
    });

    if (!cliente) {
      throw new HttpException('Cliente no encontrado', HttpStatus.NOT_FOUND);
    }

    // En lugar de eliminar, podríamos marcarlo como inactivo
    // Pero en nuestro esquema actual no tenemos campo estado para cliente_final
    // Por ahora simplemente eliminamos
    await this.clienteRepository.remove(cliente);

    return { message: 'Cliente eliminado correctamente' };
  }
}