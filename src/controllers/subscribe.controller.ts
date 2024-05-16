import { Request, Response } from 'express';

import logger from '../config/logger';
import { SubscribeUserByEmail } from '../models/subscribe.types';
import subscribeService from '../services/subscribe.service';
import catchAsync from '../utils/catchAsync';

export const subscribeUserByEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, name }: SubscribeUserByEmail = req.body;

  void (await subscribeService.subscribeUserByEmail({ email, name }));

  logger.info(`User with email ${email} was subscribed at `);

  res.status(200).send('E-mail added!');
});
