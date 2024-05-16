import { Request, Response } from 'express';

import { RateRequest } from '../models/rate.types';
import RateService from '../services/rate.service';
import catchAsync from '../utils/catchAsync';

export const rateController = catchAsync(async (req: Request, res: Response) => {
  const { from, to } = req.query;

  const rateRequest: RateRequest = {
    from: (from as string) || 'USD',
    to: (to as string) || 'UAH'
  };

  const rates = await RateService.getCurrentRate(rateRequest);

  res.status(200).send(rates);
});
