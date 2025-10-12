export declare class User {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
    password_hash: string;
    rol: 'jefe' | 'ejecutiva' | 'empresa' | 'cliente';
    telefono: string;
    activo: boolean;
    fecha_creacion: Date;
    ultima_conexion: Date;
    intentos_fallidos: number;
    bloqueado_hasta: Date;
    ip_bloqueada: string;
}
