import createHttpError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { ERR_MSG } from '../constants/contacts.js';
import { isDefined } from '../utils/isDefined.js';

export const getAllContacts = async (
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const { type, isFavourite } = filter;

  const contactsQuery = ContactsCollection.find();
  const countQuery = ContactsCollection.find();

  if (isDefined(type)) {
    contactsQuery.where('contactType').equals(type);
  }
  if (isDefined(isFavourite)) {
    contactsQuery.where('isFavourite').equals(isFavourite);
  }

  const [paginationData, contacts] = await Promise.all([
    countQuery
      .merge(contactsQuery)
      .countDocuments()
      .then(contactsCount => {
        const paginationData = calculatePaginationData(
          contactsCount,
          page,
          perPage,
        );
        if (
          contactsCount > 0 &&
          (page < 1 || page > paginationData.totalPages)
        ) {
          throw createHttpError(400, ERR_MSG[400], {
            details: `The current page (${page}) must be in the following range  [1, ${paginationData.totalPages}]`,
          });
        }
        return paginationData;
      }),
    contactsQuery
      .limit(limit)
      .skip(skip)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async contactId => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async ({
  email = null,
  isFavourite = false,
  ...required
}) => {
  const contact = await ContactsCollection.create({
    ...required,
    email,
    isFavourite,
  });

  return contact;
};

export const deleteContact = async contactId => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: !rawResult?.lastErrorObject?.updatedExisting,
  };
};
