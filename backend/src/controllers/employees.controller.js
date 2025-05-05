import {
    pool
} from '../db/db.js';

export const getEmployeeByFileNumber = async (file_number) => {
    const response = await pool.query(`SELECT empleado.* FROM empleado WHERE empleado.legajo = $1 LIMIT 20`, [file_number]);

    const employee = response.rows[0];

    if (!employee) {
        return {
            ok: false,
            message: 'No se encontró el empleado con id ' + file_number
        };
    };
    const response2 = await pool.query(`SELECT sector.sector_id, sector.nombre as nombre_sector, sector.ley, sector.sindicato, sector.obra_social, sector.cct FROM sector WHERE sector.sector_id = $1`, [employee.sector_id]);

    const sector = response2.rows[0];

    return {
        employee,
        sector
    };
};

export const getEmployees = async () => {
    const {
        rows
    } = await pool.query(`SELECT empleado.cuit, empleado.legajo, empleado.nombre, empleado.apellido FROM empleado`);
    return rows;
};

export const getEmployeesInexact = async (file_number) => {
    const {
        rows
    } = await pool.query(`SELECT empleado.cuit, empleado.legajo, empleado.nombre, empleado.apellido FROM empleado WHERE CAST(empleado.legajo AS VARCHAR) LIKE $1`, [`%${file_number}%`]);
    return rows;
};