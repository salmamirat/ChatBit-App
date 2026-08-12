import fs from 'fs';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function initDB() {
    try {
        const schema = fs.readFileSync(path.resolve('./schema.sql'), 'utf8');
        await pool.query(schema);
        console.log('✅ Database initialized successfully');
    } catch (err) {
        console.error('❌ Error initializing database:', err);
    } finally {
        await pool.end();
    }
}

initDB();
