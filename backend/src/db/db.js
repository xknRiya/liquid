import {
    Pool
} from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'liquid',
    password: 'root',
    port: 5432,
});