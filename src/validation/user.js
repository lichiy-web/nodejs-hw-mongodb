import Joi from 'joi';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../constants/index.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
