import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EmpresaProveedora } from './empresa-proveedora.entity';
import { Usuario } from './usuario.entity';
import { Trazabilidad } from './trazabilidad.entity';

@Entity('cliente_empresa')
export class ClienteEmpresa {
  @PrimaryGeneratedColumn()
  id_cliente: number;

  @Column()
  id_usuario_cliente: string;

  @Column()
  id_empresa: number;

  @Column({ nullable: true })
  id_ejecutiva: number;

  @Column()
  nombre_cliente: string;

  @Column({ nullable: true })
  apellido_cliente: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ default: 'activo' })
  estado: string;

  @ManyToOne(() => EmpresaProveedora, empresa => empresa.clientes)
  @JoinColumn({ name: 'id_empresa' })
  empresa: EmpresaProveedora;

  @ManyToOne(() => Usuario, usuario => usuario.clientesAsignados)
  @JoinColumn({ name: 'id_ejecutiva' })
  ejecutiva: Usuario;

  @OneToMany(() => Trazabilidad, trazabilidad => trazabilidad.cliente)
  trazabilidades: Trazabilidad[];
}