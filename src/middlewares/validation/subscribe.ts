import Joi from 'joi';

export const validateSubscribeUserByEmail = {
  body: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().optional()
  })
};
