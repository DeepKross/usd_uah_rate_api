import { Request, Response } from 'express';

export const healthcheck = (_: Request, res: Response) => {
  res.send('Server is up and running!');
};
