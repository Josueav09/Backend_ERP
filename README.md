🚀 ERP Backend - Arquitectura de Microservicios (NestJS)
<p align="center"> <a href="https://nestjs.com/" target="_blank"> <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" /> </a> </p><p align="center"> <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js 18+"> <img src="https://img.shields.io/badge/NestJS-11+-red?logo=nestjs" alt="NestJS 11+"> <img src="https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript" alt="TypeScript 5.0+"> <img src="https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql" alt="PostgreSQL 15+"> <img src="https://img.shields.io/badge/Architecture-Microservices-orange" alt="Microservices Architecture"> <img src="https://img.shields.io/badge/TypeORM-0.3+-blue" alt="TypeORM 0.3+"> </p>
🧠 Descripción General
ERP Backend desarrollado con NestJS bajo una arquitectura de microservicios modular y escalable.
Incluye un API Gateway, microservicios especializados, autenticación JWT, seguridad avanzada y un esquema multi-tenant con PostgreSQL.

🏗️ Arquitectura General
📂 Estructura del Monorepo
bash
backend_ERP/
│
├── 📁 api-gateway/                 # 🚪 API Gateway principal (Puerto 3000)
│   └── src/
│       ├── controllers/            # Controladores de rutas globales
│       ├── middleware/             # Middlewares globales
│       ├── filters/                # Filtros de excepciones
│       └── main.ts
│
├── 📁 services/                    # ⚙️ Microservicios especializados
│   ├── auth-service/               # 🔐 Autenticación & JWT (3001)
│   ├── user-service/               # 👥 Usuarios y roles (3002)
│   ├── sales-service/              # 🛒 Ventas y clientes (3003)
│   ├── product-service/            # 📦 Inventario y productos (3004)
│   ├── marketing-service/          # 📢 Marketing y leads (3005)
│   ├── reporting-service/          # 📊 Reportes y estadísticas (3006)
│   └── traceability-service/       # 🔍 Auditoría y trazabilidad (3007)
│
├── 📁 shared/                      # 🧩 Código compartido
│   ├── database/                   # Configuración DB y TypeORM DataSource
│   ├── migrations/                 # 🗃️ Migraciones de base de datos
│   │   └── 1700000000000-CreateTriggersAndViews.ts
│   ├── entities/                   # 🗂️ Entidades de base de datos
│   ├── utils/                      # ⚙️ Utilidades y configuraciones
│   │   ├── database.ts            # Configuración Pool PostgreSQL
│   │   └── data-source.ts         # Configuración TypeORM DataSource
│   └── dto/                       # 📋 Data Transfer Objects
│
├── 📄 ormconfig.json              # ⚙️ Configuración TypeORM para migraciones
├── 📄 package.json                # 📦 Dependencias y scripts del monorepo
├── 📄 nest-cli.json               # 🔧 Configuración de proyectos NestJS
├── 📄 tsconfig.json               # 📝 Configuración TypeScript global
└── 📄 README.md                   # 📚 Documentación general del backend
🌐 Flujo de Requests
text
Frontend → API Gateway (3000) → Microservicio correspondiente
Ejemplo de ruteo interno:

Request público	Servicio destino interno
GET /jefe/stats	User Service (3002)
GET /jefe/auditoria	Traceability Service (3007)
GET /jefe/clientes	Sales Service (3003)
GET /jefe/empresas	User Service (3002)
⚙️ Requisitos Previos
🟢 Node.js 18 o superior

🟣 npm 8+

🐘 PostgreSQL 15+

🐳 Docker (opcional, para despliegue contenedorizado)

🔧 Instalación y Configuración
1️⃣ Clonar e instalar dependencias
bash
git clone <tu-repositorio>
cd backend_ERP
npm install
2️⃣ Configuración de Base de Datos
Variables de entorno (.env):

bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=josue12345
DB_NAME=growviabd

# JWT Configuration
JWT_SECRET=tu-jwt-secret-super-seguro
JWT_EXPIRES_IN=1d

# Service Ports
API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
SALES_SERVICE_PORT=3003
3️⃣ Configuración de Migraciones
Archivo shared/utils/data-source.ts:

typescript
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'josue12345',
  database: process.env.DB_NAME || 'growviabd',
  entities: ['shared/**/*.entity.ts', 'services/**/*.entity.ts'],
  migrations: ['shared/migrations/*.ts'],
  synchronize: false,
  logging: true,
  migrationsTableName: 'migrations',
});

export default AppDataSource;
🚀 Scripts Disponibles
🔄 Scripts de Desarrollo
Comando	Descripción
npm run start:all	Inicia todos los servicios en desarrollo
npm run start:dev:gateway	Inicia solo el API Gateway
npm run start:dev:user	Inicia el servicio de usuarios
npm run start:dev:sales	Inicia el servicio de ventas
🏗️ Scripts de Build
Comando	Descripción
npm run build	Compila todos los servicios
npm run build:user	Compila solo el servicio de usuarios
npm run build:all	Compila todos los servicios en paralelo
🗃️ Scripts de Migración
Comando	Descripción
npm run migration:run	✅ Ejecuta migraciones pendientes
npm run migration:generate	Genera nueva migración desde entidades
npm run migration:create	Crea archivo de migración vacío
npm run migration:revert	Revierte la última migración
npm run migration:show	Muestra estado de migraciones
🐳 Scripts Docker
Comando	Descripción
npm run docker:build	Construye imágenes Docker
npm run docker:up	Levanta los contenedores
npm run docker:down	Detiene todos los contenedores
📡 Endpoints Principales
🧠 API Gateway (Puerto 3000)
Método	Endpoint	Descripción	Servicio
GET	/jefe/stats	Estadísticas generales	User Service
GET	/jefe/auditoria	Auditoría de contratos	Traceability
GET	/jefe/clientes	Lista de clientes	Sales Service
GET	/jefe/empresas	Empresas registradas	User Service
GET	/jefe/trazabilidad	Trazabilidad de cambios	Traceability
🔐 Auth Service (Puerto 3001)
Método	Endpoint	Descripción
POST	/auth/login	Inicio de sesión
POST	/auth/verify-email	Verificación de correo
GET	/auth/captcha	Generación de CAPTCHA
🗃️ Modelo de Datos y Migraciones
📊 Base de Datos Configurada
Base de datos: growviabd

Motor: PostgreSQL 15+

Migraciones: TypeORM con soporte completo

✅ Migraciones Implementadas
Triggers automáticos: 

update_updated_at_column() - Actualización automática de timestamps

set_fecha_cierre() - Fecha de cierre automática en ventas ganadas

Vistas del sistema:

vista_dashboard_ejecutiva - Métricas para dashboard

vista_pipeline_ventas - Pipeline de oportunidades activas

vista_ejecutivas_disponibles - Ejecutivas sin empresa asignada

🏢 Esquema Principal
sql
-- Tablas principales
JEFE                    -- Administradores del sistema
EMPRESA_PROVEEDORA      -- Empresas proveedoras
EJECUTIVA               -- Ejecutivas de ventas
CLIENTE_FINAL           -- Clientes finales
PERSONA_CONTACTO        -- Contactos de clientes
TRAZABILIDAD            -- Oportunidades y gestiones
🔒 Seguridad Implementada
✅ JWT Authentication con refresh tokens

✅ Role-Based Access Control (RBAC)

✅ Rate Limiting y bloqueo de fuerza bruta

✅ CORS configurado para orígenes específicos

✅ Helmet para cabeceras HTTP seguras

✅ Validación de datos con class-validator

✅ Triggers de auditoría automáticos en base de datos

🛠️ Características Técnicas
🗃️ Gestión de Base de Datos
typescript
// Ejemplo de entidad TypeORM
@Entity('JEFE')
export class JefeEntity {
  @PrimaryGeneratedColumn()
  id_jefe: number;

  @Column()
  nombre_completo: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @UpdateDateColumn()
  fecha_actualizacion: Date;
}
🔄 Migraciones TypeORM
typescript
// Ejemplo de migración
export class CreateTriggersAndViews1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Triggers y vistas implementadas
  }
}
🚀 Despliegue Rápido
1. Instalar dependencias:
bash
npm install
2. Configurar base de datos:
bash
# Asegúrate de que PostgreSQL esté ejecutándose
# Las credenciales por defecto están en shared/utils/data-source.ts
3. Ejecutar migraciones:
bash
npm run migration:run
4. Iniciar servicios:
bash
npm run start:all
🤝 Contribución
Haz un fork del repositorio

Crea una rama de desarrollo: git checkout -b feature/nueva-funcionalidad

Realiza los cambios y commits con mensajes claros

Abre un Pull Request con descripción detallada

👨‍💻 Autor
Josue Ayala
Desarrollador Full Stack | Ingeniería de Sistemas
📧 josueabrahm.av@gmail.com

<p align="center"> <sub>Hecho con ❤️ usando <a href="https://nestjs.com/">NestJS</a> y arquitectura de microservicios escalable.</sub> </p>
