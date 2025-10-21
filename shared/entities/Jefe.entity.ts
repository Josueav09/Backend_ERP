// backend_ERP/shared/entities/Jefe.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Ejecutiva } from './Ejecutiva.entity';
@Entity('jefe')
export class Jefe {
  @PrimaryGeneratedColumn()
  id_jefe: number;

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

  // ✅ NUEVO CAMPO - Agregar esto
  @Column({ 
    type: 'varchar', 
    length: 20, 
    default: 'Jefe',
    enum: ['Jefe', 'Administrador']
  })
  rol: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;

  @OneToMany(() => Ejecutiva, ejecutiva => ejecutiva.jefe)
  ejecutivas: Ejecutiva[];
}