// backend_ERP/shared/entities/PersonaContacto.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ClienteFinal } from './ClienteFinal.entity';
import { Trazabilidad } from './Trazabilidad.entity';

@Entity('persona_contacto')
export class PersonaContacto {
  @PrimaryGeneratedColumn()
  id_contacto: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  dni: string;

  @Column({ type: 'varchar', length: 255 })
  nombre_completo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cargo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  correo: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  linkedin: string;

  @ManyToOne(() => ClienteFinal, cliente => cliente.personas_contacto)
  @JoinColumn({ name: 'id_cliente_final' })
  cliente_final: ClienteFinal;

  @OneToMany(() => Trazabilidad, trazabilidad => trazabilidad.persona_contacto)
  trazabilidades: Trazabilidad[];

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}