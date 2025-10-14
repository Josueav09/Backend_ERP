export declare class EjecutivaService {
    getStats(ejecutivaId: string): Promise<{
        totalEmpresas: number;
        totalClientes: number;
        actividadesMes: number;
    }>;
    getEmpresas(ejecutivaId: string): Promise<any[]>;
    createEmpresa(data: {
        nombre_empresa: string;
        rut: string;
        direccion: string;
        telefono: string;
        email_contacto: string;
        ejecutivaId: string;
    }): Promise<any>;
    getClientes(ejecutivaId: string): Promise<any[]>;
    createCliente(data: {
        id_empresa: string;
        id_ejecutiva: string;
        nombre_cliente: string;
        rut_cliente: string;
        direccion: string;
        telefono: string;
        email: string;
    }): Promise<any>;
}
