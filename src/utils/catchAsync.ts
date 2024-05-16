import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync = <
  P = Record<string, never>,
  ResBody = never,
  ReqBody = never,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, never> = Record<string, never>
>(
  fn: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>
): RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals> => {
  return async (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction
  ) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default catchAsync;
