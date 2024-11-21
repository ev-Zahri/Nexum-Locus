const { Pool } = require('pg');
require('dotenv').config();

// Koneksi ke Neon Postgres
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;