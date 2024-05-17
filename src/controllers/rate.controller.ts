import { Request, Response } from 'express';

import RateService from '../services/rate.service';
import catchAsync from '../utils/catchAsync';

export const rateController = catchAsync(async (req: Request, res: Response) => {
  const { from, to } = req.query;

  const rates = await RateService.getCurrentRate(from as string, to as string);

  res.status(200).send(rates);
});
