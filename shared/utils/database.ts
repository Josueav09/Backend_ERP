import { Pool } from 'pg';

export const pool = new Pool({
  user: process.env.DB_USER || 'admingrowvia',
  host: process.env.DB_HOST || 'growviabd.postgres.database.azure.com',
  database: process.env.DB_NAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Gr0wv1aX25BdM7',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

export const sql = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};