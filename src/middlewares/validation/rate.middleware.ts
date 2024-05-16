import Joi from 'joi';

export const validateGetRate = {
  query: Joi.object({
    from: Joi.string().optional(),
    to: Joi.string().optional()
  })
};
