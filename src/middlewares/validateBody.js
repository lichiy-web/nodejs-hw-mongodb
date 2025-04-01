import createHttpError from 'http-errors';
import { ERR_MSG } from '../constants/contacts.js';

export const validateBody = schema => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const error = createHttpError(400, ERR_MSG[400], {
      errors: err.details,
    });
    next(error);
  }
};
