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