import {
    pool
} from '../db/db.js';

export const getBaseRemuneration = async (sector_id, category_name) => {
    const {
        rows
    } = await pool.query(`SELECT * FROM remuneracion WHERE sector_id = $1 AND categoria_nombre = $2 AND nombre = 'Sueldo Básico'`, [sector_id, category_name]);
    return rows;
};

export const getRemunerationsBySectorAndCategory = async (sector_id, category_name) => {
    const [base] = await getBaseRemuneration(sector_id, category_name);
    const {
        rows
    } = await pool.query(`SELECT * FROM remuneracion WHERE sector_id = $1 AND categoria_nombre = $2 AND nombre != 'Sueldo Básico'`, [sector_id, category_name]);
    return {
        base,
        remunerations: rows
    };
};