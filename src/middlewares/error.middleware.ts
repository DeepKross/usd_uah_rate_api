import { NextFunction, Request, Response } from 'express';

import APIError from '../utils/APIError';

export const errorMiddleware = (err: APIError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message
  });

  next(err);
};
