import Joi from 'joi';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../constants/index.js';

export const createContactSchema = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH).required(),
  phoneNumber: Joi.string()
    .min(NAME_MIN_LENGTH)
    .max(NAME_MAX_LENGTH)
    .required(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  userId: Joi.string().required(),
  name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
  phoneNumber: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
