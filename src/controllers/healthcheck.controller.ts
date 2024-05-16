import { Request, Response } from 'express';
import { getHealthcheckMsg} from '../services/healthcheck.services';

export const healthcheckController = (_: Request, res: Response) => {
  const response = getHealthcheckMsg();
  res.send(response);
};
