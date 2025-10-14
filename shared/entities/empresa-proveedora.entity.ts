import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClienteEmpresa } from './cliente-empresa.entity';
import { Trazabilidad } from './trazabilidad.entity';

@Entity('empresa_proveedora')
export class EmpresaProveedora {
  @PrimaryGeneratedColumn()
  id_empresa: number;

  @Column()
  nombre_empresa: string;

  @Column({ nullable: true })
  rut: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  email_contacto: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => ClienteEmpresa, cliente => cliente.empresa)
  clientes: ClienteEmpresa[];

  @OneToMany(() => Trazabilidad, trazabilidad => trazabilidad.empresa)
  trazabilidades: Trazabilidad[];
}