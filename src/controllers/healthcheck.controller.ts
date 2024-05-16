import { Request, Response } from 'express';

import { getHealthcheckMsg } from '../services/healthcheck.services';
import APIError from '../utils/APIError';
import catchAsync from '../utils/catchAsync';

export const healthcheckController = catchAsync((_: Request, res: Response) => {
  const response = getHealthcheckMsg();

  res.send(new APIError(200, response));

  res.send(response);
});
