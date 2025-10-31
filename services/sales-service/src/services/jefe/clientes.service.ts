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
  ) { }

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

  // En tu ClientesService - método create CORREGIDO
  async create(data: any) {
    try {

      // Validaciones básicas
      if (!data.razon_social) {
        throw new HttpException('La razón social es obligatoria', HttpStatus.BAD_REQUEST);
      }

      if (!data.id_ejecutiva) {
        throw new HttpException('Debe asignar una ejecutiva', HttpStatus.BAD_REQUEST);
      }

      if (!data.id_empresa_prov) {
        throw new HttpException('Debe asignar una empresa proveedora', HttpStatus.BAD_REQUEST);
      }

      // ✅ VERIFICAR QUE LA EJECUTIVA PERTENECE A LA EMPRESA
      const ejecutiva = await this.ejecutivaRepository.findOne({
        where: {
          id_ejecutiva: data.id_ejecutiva,
          empresa_proveedora: { id_empresa_prov: data.id_empresa_prov } // ✅ VERIFICAR RELACIÓN
        },
        relations: ['empresa_proveedora']
      });

      if (!ejecutiva) {
        throw new HttpException(
          'La ejecutiva seleccionada no pertenece a la empresa proveedora especificada',
          HttpStatus.BAD_REQUEST
        );
      }

      // ✅ VERIFICAR QUE LA EMPRESA EXISTE
      const empresa = await this.empresaRepository.findOne({
        where: { id_empresa_prov: data.id_empresa_prov }
      });

      if (!empresa) {
        throw new HttpException('La empresa proveedora seleccionada no existe', HttpStatus.BAD_REQUEST);
      }

      // Verificar RUC duplicado
      if (data.ruc) {
        const existeRuc = await this.clienteRepository.findOne({
          where: {
            ruc: data.ruc,
            empresa_proveedora: { id_empresa_prov: data.id_empresa_prov }
          }
        });

        if (existeRuc) {
          throw new HttpException('Ya existe un cliente con ese RUC en esta empresa', HttpStatus.CONFLICT);
        }
      }

      // ✅ CREAR CLIENTE CON LA EMPRESA CORRECTA
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
        empresa_proveedora: empresa, // ✅ ASIGNAR EMPRESA DIRECTAMENTE
        estado: 'Activo'
      });

      const clienteGuardado = await this.clienteRepository.save(nuevoCliente);

      return {
        ...clienteGuardado,
        ejecutiva_nombre: ejecutiva.nombre_completo,
        empresa_nombre: empresa.razon_social,
        total_actividades: 0,
        estado: 'Activo'
      };

    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        error.message || 'Error al crear el cliente',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
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


}