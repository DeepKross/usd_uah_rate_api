import { Router } from 'express';

import healthcheckRoutes from './healthcheck.routes';
import rateRoutes from './rate.routes';
import subscribeRoutes from './subscribe.routes';

const router = Router();

router.use('/', healthcheckRoutes);
router.use('/rate', rateRoutes);
router.use('/subscribe', subscribeRoutes);

export default router;
