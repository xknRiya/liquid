import {
    getRemunerationsBySectorAndCategory
} from '../controllers/remunerations.controller.js';
import {
    Router
} from 'express';

const app = Router();

app.get('/remunerations/:sector_id/category/:category_name', async (req, res) => {
    const remunerations = await getRemunerationsBySectorAndCategory(req.params.sector_id, req.params.category_name);
    res.send(remunerations);
});

export default app;