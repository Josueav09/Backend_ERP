// backend/services/auth-service/src/users/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ 
    type: 'varchar', 
    length: 20,
  })
  rol: 'jefe' | 'ejecutiva' | 'empresa' | 'cliente';

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  ultima_conexion: Date;

  @Column({ type: 'integer', default: 0 })
  intentos_fallidos: number;

  @Column({ type: 'timestamp', nullable: true })
  bloqueado_hasta: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip_bloqueada: string;
}