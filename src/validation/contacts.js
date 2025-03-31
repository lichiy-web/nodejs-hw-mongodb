import Joi from 'joi';
const MIN_LENGTH = 3;
const MAX_LENGTH = 20;

export const createContactSchema = Joi.object({
  name: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH).required(),
  phoneNumber: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH).required(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH),
  phoneNumber: Joi.string().min(MIN_LENGTH).max(MAX_LENGTH),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
