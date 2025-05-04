import createHttpError from 'http-errors';
import { ContactCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { RES_MSG } from '../constants/contacts.js';
import { isDefined } from '../utils/isDefined.js';
import { deleteFileFromStorage } from '../utils/deleteFileFromStorage.js';

export const getAllContacts = async (
  userId,
  page,
  perPage,
  sortBy,
  sortOrder,
  filter = {},
) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const { type, isFavourite } = filter;

  const contactsQuery = ContactCollection.find();
  const countQuery = ContactCollection.find();

  contactsQuery.where('userId').equals(userId);
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
          throw createHttpError(400, RES_MSG[400].default, {
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

export const getContactById = async (userId, contactId) => {
  const contact = await ContactCollection.findOne({ userId, _id: contactId });
  return contact;
};

export const createContact = async ({
  userId,
  email = null,
  isFavourite = false,
  ...required
}) => {
  const contact = await ContactCollection.create({
    ...required,
    email,
    isFavourite,
    userId,
  });

  return contact;
};

export const deleteContact = async (userId, contactId) => {
  const contact = await ContactCollection.findOneAndDelete({
    userId,
    _id: contactId,
  });
  if (contact?.photo) await deleteFileFromStorage(contact.photo);
  return contact;
};

export const updateContact = async (
  userId,
  contactId,
  update,
  options = {},
) => {
  const contact = await ContactCollection.findOne({
    userId,
    _id: contactId,
  });

  const oldPhoto = contact?.photo ?? '';
  update.photo ??= options.upsert ? '' : oldPhoto;
  if (update.photo !== oldPhoto) deleteFileFromStorage(oldPhoto);

  const rawResult = await ContactCollection.findOneAndUpdate(
    { userId, _id: contactId },
    update,
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
