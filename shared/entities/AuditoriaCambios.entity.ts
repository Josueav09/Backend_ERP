// backend_ERP/shared/entities/AuditoriaCambios.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { EmpresaProveedora } from './EmpresaProveedora.entity';
import { ClienteFinal } from './ClienteFinal.entity';
import { Ejecutiva } from './Ejecutiva.entity';

@Entity('auditoria_cambios')
export class AuditoriaCambios {
  @PrimaryGeneratedColumn()
  id_auditoria: number;

  @ManyToOne(() => EmpresaProveedora, { nullable: true })
  @JoinColumn({ name: 'id_empresa_proveedora' })
  empresa_proveedora: EmpresaProveedora;

  @ManyToOne(() => ClienteFinal, { nullable: true })
  @JoinColumn({ name: 'id_cliente_final' })
  cliente_final: ClienteFinal;

  @ManyToOne(() => Ejecutiva, { nullable: true })
  @JoinColumn({ name: 'id_ejecutiva' })
  ejecutiva: Ejecutiva;

  @Column({ type: 'varchar', length: 100 })
  accion: string;

  @Column({ type: 'text' })
  detalles: string;

  @CreateDateColumn()
  fecha_accion: Date;

  @Column({ type: 'varchar', length: 150 })
  usuario_responsable: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estado_anterior: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  estado_nuevo: string;

  @Column({ type: 'text', nullable: true })
  observaciones_adicionales: string;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    nullable: true,
    enum: [
      'Fin de contrato', 'Bajo rendimiento', 'Decision estratégica', 
      'Incumplimiento', 'Mutuo acuerdo', 'Otro'
    ]
  })
  motivo_desvinculacion: string;

  @ManyToOne(() => Ejecutiva, { nullable: true })
  @JoinColumn({ name: 'id_ejecutiva_anterior' })
  ejecutiva_anterior: Ejecutiva;

  @ManyToOne(() => Ejecutiva, { nullable: true })
  @JoinColumn({ name: 'id_ejecutiva_nueva' })
  ejecutiva_nueva: Ejecutiva;
}