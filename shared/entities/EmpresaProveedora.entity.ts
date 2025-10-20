// backend_ERP/shared/entities/EmpresaProveedora.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Ejecutiva } from './Ejecutiva.entity';
import { Trazabilidad } from './Trazabilidad.entity';

@Entity('empresa_proveedora')
export class EmpresaProveedora {
  @PrimaryGeneratedColumn()
  id_empresa_prov: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  ruc: string;

  @Column({ type: 'varchar', length: 255 })
  razon_social: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pagina_web: string;

  @Column({ type: 'varchar', length: 255 })
  correo: string;

  @Column({ type: 'varchar', length: 255 })
  contraseña: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, default: 'Perú' })
  pais: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  departamento: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  provincia: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  grupo_economico: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rubro: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  sub_rubro: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    nullable: true,
    enum: ['Pequeña', 'Mediana', 'Grande']
  })
  tamanio_empresa: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  facturacion_anual: number;

  @Column({ type: 'int', nullable: true })
  cantidad_empleados: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string;

  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'Activo',
    enum: ['Activo', 'Inactivo']
  })
  estado: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @OneToMany(() => Ejecutiva, ejecutiva => ejecutiva.empresa_proveedora)
  ejecutivas: Ejecutiva[];

  @OneToMany(() => Trazabilidad, trazabilidad => trazabilidad.empresa_proveedora)
  trazabilidades: Trazabilidad[];
}