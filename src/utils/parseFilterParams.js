import { contactsSchema } from '../db/models/Contacts.js';
import { parseParams } from './parseParams.js';

const parseContactType = type =>
  parseParams('contactType', type, contactsSchema);

const parseIsFavourite = isFavourite =>
  parseParams('isFavourite', isFavourite, contactsSchema);

export const parseFilterParams = query => {
  const { type, isFavourite } = query;

  return {
    type: parseContactType(type),
    isFavourite: parseIsFavourite(isFavourite),
  };
};
