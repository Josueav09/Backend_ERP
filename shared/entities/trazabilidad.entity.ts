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

  @ManyToOne(() => Ejecutiva, ejecutiva => ejecutiva.trazabilidades)
  @JoinColumn({ name: 'id_ejecutiva' })
  ejecutiva: Ejecutiva;

  @ManyToOne(() => EmpresaProveedora, empresa => empresa.trazabilidades)
  @JoinColumn({ name: 'id_empresa_prov' })
  empresa_proveedora: EmpresaProveedora;

  @ManyToOne(() => ClienteFinal, cliente => cliente.trazabilidades)
  @JoinColumn({ name: 'id_cliente_final' })
  cliente_final: ClienteFinal;

  @ManyToOne(() => PersonaContacto, persona => persona.trazabilidades)
  @JoinColumn({ name: 'id_contacto' })
  persona_contacto: PersonaContacto;

  @Column({ type: 'date', nullable: true })
  fecha_agregado_base: Date;

  @Column({ 
    type: 'varchar', 
    length: 50,
    enum: ['Llamada', 'WhatsApp', 'Email', 'LinkedIn', 'Reunión presencial', 'Otro']
  })
  tipo_contacto: string;

  @Column({ type: 'timestamp' })
  fecha_contacto: Date;

  @Column({ 
    type: 'varchar', 
    length: 50,
    enum: ['Positivo', 'Negativo', 'Pendiente', 'Neutro']
  })
  resultado_contacto: string;

  @Column({ 
    type: 'varchar', 
    length: 50,
    enum: [
      'Prospección', 'Calificación', 'Detección de necesidades', 'Presentación de solución',
      'Manejo de objeciones', 'Presentación de propuesta', 'Negociación', 'Firma de contrato',
      'Venta ganada', 'Venta perdida', 'Venta suspendida'
    ]
  })
  etapa_oportunidad: string;

  @Column({ type: 'date', nullable: true })
  fecha_inicio: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre_oportunidad: string;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    nullable: true,
    enum: ['One-shot', 'Mensual', 'Proyecto', 'Otro']
  })
  tipo_oportunidad: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  monto_total_sin_imp: number;

  @Column({ type: 'int', nullable: true })
  probabilidad_cierre: number; // 0-100

  @Column({ type: 'date', nullable: true })
  fecha_cierre: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  monto_cierre: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn()
  fecha_creacion: Date;
}