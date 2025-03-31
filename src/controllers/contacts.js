import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { isValidId } from '../utils/isValidId.js';
import { ERR_MSG } from '../constants/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const rootController = (req, res) => {
  res.json({
    availableRoutes: ['/', '/contacts', '/contacts/:contactId'],
    availableQueries: {
      get: ['/', '/contacts', '/contacts/:contactId'],
      post: ['/contacts/:contactId'],
      delete: ['/contacts/:contactId'],
      put: ['/contacts/:contactId'],
      patch: ['/contacts/:contactId'],
    },
  });
};

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const contacts = await getAllContacts(page, perPage);

  res.status(200).json({
    status: 200,
    data: contacts,
    message: 'Successfully found contacts!',
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidId(contactId)) throw createHttpError(404, ERR_MSG[404]);
  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, ERR_MSG[404]);
  }

  res.status(200).json({
    status: 200,
    data: contact,
    message: `Successfully found contact with id ${contactId} !`,
  });
};

export const createContactController = async (req, res, next) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidId(contactId)) throw createHttpError(404, ERR_MSG[404]);

  const contact = await deleteContact(contactId);

  if (!contact) {
    throw createHttpError(404, ERR_MSG[404]);
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidId(contactId)) throw createHttpError(404, ERR_MSG[404]);

  const result = await updateContact(contactId, req.body, {
    upsert: true,
  });

  if (!result) {
    throw createHttpError(404, ERR_MSG[404]);
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidId(contactId)) throw createHttpError(404, ERR_MSG[404]);

  const result = await updateContact(contactId, req.body);

  if (!result) {
    throw createHttpError(404, ERR_MSG[404]);
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};
