"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'infogrowvia2',
    password: process.env.DB_PASSWORD || 'josue12345',
    port: parseInt(process.env.DB_PORT || '5432'),
});
exports.sql = {
    query: (text, params) => exports.pool.query(text, params),
};
//# sourceMappingURL=database.js.map