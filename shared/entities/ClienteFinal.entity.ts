// backend_ERP/shared/entities/ClienteFinal.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  OneToMany, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { Ejecutiva } from './Ejecutiva.entity';
import { PersonaContacto } from './PersonaContacto.entity';
import { Trazabilidad } from './Trazabilidad.entity';
import { EmpresaProveedora } from './EmpresaProveedora.entity';


@Entity('cliente_final') 
export class ClienteFinal {
  @PrimaryGeneratedColumn()
  id_cliente_final: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  ruc: string;

  @Column({ type: 'varchar', length: 255 })
  razon_social: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pagina_web: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  correo: string;

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

  // ✅ RELACIÓN CON EMPRESA PROVEEDORA (FALTABA)
  @Column({ type: 'int' })
  id_empresa_prov: number;

  @ManyToOne(() => EmpresaProveedora, empresa => empresa.clientes_finales)
  @JoinColumn({ name: 'id_empresa_prov' })
  empresa_proveedora: EmpresaProveedora;

  // ✅ RELACIÓN CON EJECUTIVA (CORREGIR nombre de columna)
  @Column({ type: 'int' })
  id_ejecutiva: number;

  @ManyToOne(() => Ejecutiva, ejecutiva => ejecutiva.clientes_finales)
  @JoinColumn({ name: 'id_ejecutiva' })
  ejecutiva: Ejecutiva;

  @OneToMany(() => PersonaContacto, persona => persona.cliente_final)
  personas_contacto: PersonaContacto[];

  @OneToMany(() => Trazabilidad, trazabilidad => trazabilidad.cliente_final)
  trazabilidades: Trazabilidad[];

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}