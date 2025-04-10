import createHttpError from 'http-errors';
import { RES_MSG } from '../constants/contacts.js';

export const validateBody = schema => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const errStatus =
      err?.errType === 'User registration: invalid email' ? 401 : 400;
    const error = createHttpError(errStatus, RES_MSG[errStatus].default, {
      errors: err.details,
    });
    next(error);
  }
};
