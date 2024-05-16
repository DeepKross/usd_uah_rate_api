import { Router } from 'express';

import healthcheckRoute from './healthcheck.routes';

const router = Router();

router.use('/', healthcheckRoute);

export default router;
