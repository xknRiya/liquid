import express from 'express';

import employeesRouter from './routes/employees.routes.js'
import remunerationsRouter from './routes/remunerations.routes.js'
import {
    getEmployer
} from './controllers/employer.controller.js';

const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(employeesRouter);

app.get('/employer', async (req, res) => {
    const employer = await getEmployer();
    res.send(employer);
});

app.use(remunerationsRouter);

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});