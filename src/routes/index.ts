import { Router } from 'express';

import healthcheckRoutes from './healthcheck.routes';
import rateRoutes from './rate.routes';

const router = Router();

router.use('/', healthcheckRoutes);
router.use('/rate', rateRoutes);

export default router;
