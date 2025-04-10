import createHttpError from 'http-errors';
import { ERR_MSG } from '../constants/contacts.js';

export const validateBody = schema => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const errStatus =
      err?.errType === 'User registration: invalid email' ? 401 : 400;
    const error = createHttpError(errStatus, ERR_MSG[errStatus], {
      errors: err.details,
    });
    next(error);
  }
};
