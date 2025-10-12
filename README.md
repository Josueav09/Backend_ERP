<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

<h1 align="center">🚀 ERP Backend - Arquitectura de Microservicios (NestJS)</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/NestJS-11+-red?logo=nestjs" alt="NestJS 11+">
  <img src="https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript" alt="TypeScript 5.0+">
  <img src="https://img.shields.io/badge/PostgreSQL-15+-blue?logo=postgresql" alt="PostgreSQL 15+">
  <img src="https://img.shields.io/badge/Architecture-Microservices-orange" alt="Microservices Architecture">
</p>

---

## 🧠 Descripción General

**ERP Backend** desarrollado con **NestJS** bajo una **arquitectura de microservicios** modular y escalable.  
Incluye un **API Gateway**, microservicios especializados, autenticación JWT, seguridad avanzada y un esquema multi-tenant con PostgreSQL.

---

## 🏗️ Arquitectura General

### 📂 Estructura del Monorepo

```bash
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
│   ├── auth/                       # Estrategias de autenticación
│   ├── database/                   # Configuración DB y conexiones TypeORM
│   ├── dto/                        # Data Transfer Objects
│   ├── entities/                   # Entidades de base de datos
│   ├── interceptors/               # Interceptores globales
│   └── utils/                      # Funciones auxiliares comunes
│
├── 📄 package.json                 # Dependencias y scripts del monorepo
├── 📄 nest-cli.json                # Configuración de proyectos NestJS
├── 📄 tsconfig.json                # Configuración TypeScript global
└── 📄 README.md                    # Documentación general del backend
🌐 Flujo de Requests
text
Copiar código
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
Copiar código
git clone <tu-repositorio>
cd backend_ERP
npm install
2️⃣ Crear archivo .env
bash
Copiar código
# Variables de entorno generales
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=erp_db

JWT_SECRET=tu-jwt-secret-super-seguro
JWT_EXPIRES_IN=1d

API_GATEWAY_PORT=3000
AUTH_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
SALES_SERVICE_PORT=3003
3️⃣ Inicializar Base de Datos
sql
Copiar código
-- Ejecuta en PostgreSQL
psql -U postgres -d erp_db -f init.sql
🚀 Scripts Disponibles
Comando	Descripción
npm run start:all	Inicia todos los servicios en desarrollo
npm run start:dev:gateway	Inicia solo el API Gateway
npm run start:dev:user	Inicia el servicio de usuarios
npm run build	Compila todos los servicios
npm run build:user	Compila solo el servicio de usuarios
npm run start:prod	Inicia el gateway en modo producción
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

🗃️ Modelo de Datos
Tablas principales
sql
Copiar código
usuarios                 -- Roles: jefe, ejecutiva, cliente
empresa_proveedora       -- Datos de empresas proveedoras
cliente_empresa          -- Relación entre clientes y empresas
empresa_ejecutiva        -- Asignación empresa-ejecutiva
trazabilidad             -- Registros de auditoría
auditoria_contratos      -- Cambios y eventos relevantes
🧩 Multi-Tenancy
Arquitectura por esquema: cada cliente tiene su propio esquema.

Row-Level Security (RLS): seguridad por filas en PostgreSQL.

Zero Trust Architecture: autenticación estricta en cada request.

🔒 Seguridad
✅ JWT Authentication con refresh tokens
✅ Role-Based Access Control (RBAC)
✅ Rate Limiting y bloqueo de fuerza bruta
✅ CORS configurado para orígenes específicos
✅ Helmet para cabeceras HTTP seguras
✅ Validación de datos con class-validator

typescript
Copiar código
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}
🧰 Buenas Prácticas
Usa nest build <project> para compilar servicios correctamente.

Mantén rootDir apuntando a src y outDir a ../../dist/<service>.

Verifica que el archivo main.js esté en la carpeta esperada (dist/<service>/main.js).

Usa PM2 o Docker Compose para despliegues productivos.

🤝 Contribución
Haz un fork del repositorio.

Crea una rama de desarrollo: git checkout -b feature/nueva-funcionalidad.

Realiza los cambios y commits con mensajes claros.

Abre un Pull Request con la descripción detallada.

🧑‍💻 Autor
Josue Ayala
Desarrollador Full Stack | Ingeniería de Sistemas
📧 josueabrahm.av@gmail.com
💼 LinkedIn (opcional)

<p align="center"> <sub>Hecho con ❤️ usando <a href="https://nestjs.com/">NestJS</a> y amor por la arquitectura limpia.</sub> </p> ```