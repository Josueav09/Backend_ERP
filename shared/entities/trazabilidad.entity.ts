// backend_ERP/shared/entities/Trazabilidad.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Ejecutiva } from './Ejecutiva.entity';
import { EmpresaProveedora } from './EmpresaProveedora.entity';
import { ClienteFinal } from './ClienteFinal.entity';
import { PersonaContacto } from './PersonaContacto.entity';

@Entity('trazabilidad')
export class Trazabilidad {
  @PrimaryGeneratedColumn()
  id_trazabilidad: number;

  @Column({ type: 'int' })
  id_ejecutiva: number;

  @ManyToOne(() => Ejecutiva, ejecutiva => ejecutiva.trazabilidades)
  @JoinColumn({ name: 'id_ejecutiva' })
  ejecutiva: Ejecutiva;

  @ManyToOne(() => EmpresaProveedora, empresa => empresa.trazabilidades)
  @JoinColumn({ name: 'id_empresa_prov' })
  empresa_proveedora: EmpresaProveedora;

  
  @Column({ type: 'int' })
  id_cliente_final: number;

  @ManyToOne(() => ClienteFinal, cliente => cliente.trazabilidades)
  @JoinColumn({ name: 'id_cliente_final' })
  cliente_final: ClienteFinal;

  @ManyToOne(() => PersonaContacto, persona => persona.trazabilidades)
  @JoinColumn({ name: 'id_contacto' })
  persona_contacto: PersonaContacto;

  // ETAPA 1: GENERACIÓN DE LA OPORTUNIDAD
  @Column({ type: 'date', nullable: true })
  fecha_agregado_base: Date;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['Llamada telefónica', 'Chat de Whatsapp', 'Correo electrónico', 'Contacto por linkedin', 'Reunión presencial', 'Otro']
  })
  tipo_contacto: string;

  @Column({ type: 'timestamp' })
  fecha_contacto: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_respuesta: Date;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['Positivo', 'Negativo', 'Pendiente', 'Neutro']
  })
  resultado_contacto: string;

  @Column({ type: 'text', nullable: true })
  informacion_importante: string;

  // Campos de Reunión (Etapa 1)
  @Column({ type: 'boolean', default: false })
  reunion_agendada: boolean;

  @Column({ type: 'timestamp', nullable: true })
  fecha_reunion: Date;

  @Column({ type: 'text', nullable: true })
  participantes: string;

  @Column({ type: 'boolean', nullable: true })
  se_dio_reunion: boolean;

  @Column({ type: 'text', nullable: true })
  resultados_reunion: string;

  @Column({ type: 'boolean', default: false })
  pasa_embudo_ventas: boolean;

  // ETAPA 2: GESTIÓN DE LA OPORTUNIDAD
  @Column({ type: 'date', nullable: true })
  fecha_inicio_etapa: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre_oportunidad: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    enum: ['One-shot', 'Mensual', 'Proyecto', 'Otro']
  })
  tipo_oportunidad: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    enum: [
      'Prospección', 'Calificación', 'Detección de necesidades', 'Presentación de solución',
      'Manejo de objeciones', 'Presentación de propuesta', 'Negociación', 'Firma de contrato',
      'Venta ganada', 'Venta perdida', 'Venta suspendida'
    ]
  })
  etapa_oportunidad: string;

  @Column({ type: 'text', nullable: true })
  producto_ofrecido: string;

  @Column({ type: 'date', nullable: true })
  fecha_registro_oportunidad: Date;

  @Column({ type: 'date', nullable: true })
  fecha_cierre_esperado: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  monto_total_sin_imp: number;

  @Column({ type: 'int', nullable: true })
  probabilidad_cierre: number; // 0-100

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  monto_cierre_final: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  fecha_creacion: Date;
}