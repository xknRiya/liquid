import {
    Router
} from "express";

import {
    getEmployeeByFileNumber,
    getEmployees,
    getEmployeesInexact
} from '../controllers/employees.controller.js';

const app = Router();

app.get('/employee/:file_number', async (req, res) => {
    const employee = await getEmployeeByFileNumber(req.params.file_number);
    res.send(employee);
});

app.get('/employees', async (req, res) => {
    const employees = await getEmployees();
    res.send(employees);
});

app.get('/employees/inexact/:file_number', async (req, res) => {
    const employees = await getEmployeesInexact(req.params.file_number);
    res.send(employees);
});

export default app;