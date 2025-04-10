import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';
import { RES_MSG } from '../constants/contacts.js';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw createHttpError(400, RES_MSG[401].default, {
      details: `ContactId: ${contactId} is not valid`,
    });
  }
  next();
};
