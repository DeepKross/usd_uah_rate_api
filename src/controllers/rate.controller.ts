import { Request, Response } from 'express';

import RateService from '../services/rate.service';
import APIError from '../utils/APIError';
import catchAsync from '../utils/catchAsync';

const getRateController = catchAsync(async (req: Request, res: Response) => {
  const { from, to } = req.query;

  const rates = await RateService.getCurrentRate(from as string, to as string);

  if (Object.keys(rates).length === 0) {
    throw new APIError(404, 'No rates found');
  }

  res.status(200).send(rates);
});

export default {
  getRateController
};
