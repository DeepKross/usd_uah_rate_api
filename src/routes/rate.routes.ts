import { Router } from 'express';

import rateController from '../controllers/rate.controller';
import { validateGetRate } from '../middlewares/validation/rate.middleware';
import validate from '../utils/validate';

const router = Router();

router.get('/', validate(validateGetRate), rateController.getRateController);

export default router;
