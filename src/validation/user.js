import Joi from 'joi';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../constants/index.js';
import createHttpError from 'http-errors';
import { RES_MSG } from '../constants/contacts.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH).required(),
  email: Joi.string()
    .email()
    .error(
      createHttpError(401, RES_MSG[401], {
        details: 'Incorect email while registering an user',
        errType: 'User registration: invalid email',
      }),
    )
    .required(),
  password: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
