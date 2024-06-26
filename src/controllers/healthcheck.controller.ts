import { Request, Response } from 'express';

import { getHealthcheckMsg } from '../services/healthcheck.service';
import catchAsync from '../utils/catchAsync';

export const healthcheckController = catchAsync((_: Request, res: Response) => {
  const response = getHealthcheckMsg();

  res.send(response);
});
