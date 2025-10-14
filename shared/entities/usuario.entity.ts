import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClienteEmpresa } from './cliente-empresa.entity';
import { Trazabilidad } from './trazabilidad.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @Column()
  rol: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => ClienteEmpresa, cliente => cliente.ejecutiva)
  clientesAsignados: ClienteEmpresa[];

  @OneToMany(() => Trazabilidad, trazabilidad => trazabilidad.ejecutiva)
  trazabilidades: Trazabilidad[];
}