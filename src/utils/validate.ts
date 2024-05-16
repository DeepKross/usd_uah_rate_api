import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi from 'joi';

import pick from '../utils/pick';

import ApiError from './APIError';

const validate = (schema: object) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const obj = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(obj);

  if (error) {
    const errorMessage = error.details.map((detail) => detail.message as string).join(', ');

    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }

  Object.assign(req, value);

  return next();
};

export default validate;