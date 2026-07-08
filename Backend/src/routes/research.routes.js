import { Router } from 'express';
import { createResearchRequest } from '../controllers/research.controller.js';

const router = Router();

router.post('/', createResearchRequest);

export default router;