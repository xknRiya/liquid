import {
    pool
} from "../db/db.js";

export const getEmployer = async () => {
    const {
        rows
    } = await pool.query(`SELECT * FROM empleador WHERE cuit = 20752514752`);
    return rows[0];
};