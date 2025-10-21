// backend_ERP/shared/entities/Ejecutiva.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Jefe } from './Jefe.entity';
import { EmpresaProveedora } from './EmpresaProveedora.entity';
import { ClienteFinal } from './ClienteFinal.entity';
import { Trazabilidad } from './Trazabilidad.entity';

@Entity('ejecutiva')
export class Ejecutiva {
  @PrimaryGeneratedColumn()
  id_ejecutiva: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  dni: string;

  @Column({ type: 'varchar', length: 255 })
  nombre_completo: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  correo: string;

  @Column({ type: 'varchar', length: 255 })
  contraseña: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'Activo',
    enum: ['Activo', 'Inactivo', 'Suspendido']
  })
  estado_ejecutiva: string;

  @ManyToOne(() => Jefe, jefe => jefe.ejecutivas)
  @JoinColumn({ name: 'id_jefe' })
  jefe: Jefe;

    // ✅ RELACIÓN CON EMPRESA PROVEEDORA (FALTABA EL CAMPO id_empresa_prov)
  @Column({ type: 'int', nullable: true })
  id_empresa_prov: number;

  @ManyToOne(() => EmpresaProveedora, empresa => empresa.ejecutivas, { nullable: true })
  @JoinColumn({ name: 'id_empresa_prov' })
  empresa_proveedora: EmpresaProveedora;

  @OneToMany(() => ClienteFinal, cliente => cliente.ejecutiva)
  clientes_finales: ClienteFinal[];

  @OneToMany(() => Trazabilidad, trazabilidad => trazabilidad.ejecutiva)
  trazabilidades: Trazabilidad[];

  @OneToMany(() => EmpresaProveedora, empresa => empresa.ejecutiva_registro)
  empresas_registradas: EmpresaProveedora[];

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}