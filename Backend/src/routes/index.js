import { Router } from 'express';
import healthRoutes from './health.routes.js';
import researchRoutes from './research.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/research', researchRoutes);

export default router;