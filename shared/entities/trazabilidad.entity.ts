import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { EmpresaProveedora } from './empresa-proveedora.entity';
import { ClienteEmpresa } from './cliente-empresa.entity';

@Entity('trazabilidad')
export class Trazabilidad {
  @PrimaryGeneratedColumn()
  id_trazabilidad: number;

  @Column()
  id_ejecutiva: number;

  @Column()
  id_empresa: number;

  @Column()
  id_cliente: number;

  @Column()
  tipo_actividad: string;

  @Column()
  descripcion: string;

  @Column()
  fecha_actividad: string;

  @Column()
  estado: string;

  @Column({ nullable: true })
  notas: string;

  @ManyToOne(() => Usuario, usuario => usuario.trazabilidades)
  @JoinColumn({ name: 'id_ejecutiva' })
  ejecutiva: Usuario;

  @ManyToOne(() => EmpresaProveedora, empresa => empresa.trazabilidades)
  @JoinColumn({ name: 'id_empresa' })
  empresa: EmpresaProveedora;

  @ManyToOne(() => ClienteEmpresa, cliente => cliente.trazabilidades)
  @JoinColumn({ name: 'id_cliente' })
  cliente: ClienteEmpresa;
}