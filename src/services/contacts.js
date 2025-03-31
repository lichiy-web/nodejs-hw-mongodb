import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async (page, perPage) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();
  const countQuery = ContactsCollection.find();

  const contactsCount = await countQuery.merge(contactsQuery).countDocuments();

  const contacts = await contactsQuery.limit(limit).skip(skip).exec();
  const paginationData = calculatePaginationData(contactsCount, page, perPage);
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
