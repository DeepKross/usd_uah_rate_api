import { Router } from 'express';

import { subscribeUserByEmail } from '../controllers/subscribe.controller';
import { validateSubscribeUserByEmail } from '../middlewares/validation/subscribe';
import validate from '../utils/validate';

const router = Router();

router.post('/', validate(validateSubscribeUserByEmail), subscribeUserByEmail);

export default router;
