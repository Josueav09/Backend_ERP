import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'growviabd.postgres.database.azure.com',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'admingrowvia',
  password: process.env.DB_PASSWORD || 'Gr0wv1aX25BdM7',
  database: process.env.DB_NAME || 'postgres',
  
  // Rutas corregidas
  entities: [
    path.join(__dirname, '../**/*.entity{.ts,.js}'),
    path.join(__dirname, '../../services/**/*.entity{.ts,.js}')
  ],
  
  migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
  
  synchronize: false,
  logging: true,
  migrationsTableName: 'migrations',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

export default AppDataSource;