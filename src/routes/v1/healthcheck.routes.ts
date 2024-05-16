import { Router } from 'express';

import { healthcheckController } from '../../controllers/healthcheck.controller';

const router = Router();

router.route('/').get(healthcheckController);

export default router;
