import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { ERR_MSG } from '../constants/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactSchema } from '../db/models/contact.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const rootController = (req, res) => {
  res.json({
    availableRoutes: ['/', '/contacts', '/contacts/:contactId'],
    availableQueries: {
      get: [
        '/',
        '/contacts',
        '/contacts?page={number}&perPage={number}&sortBy={contactFieldName}&sortOrder={asc|desc}&type={personal|home|work}l&isFavourite={true|false}',
        '/contacts/:contactId',
      ],
      post: ['/contacts/:contactId'],
      delete: ['/contacts/:contactId'],
      put: ['/contacts/:contactId'],
      patch: ['/contacts/:contactId'],
    },
  });
};

export const getAllContactsController = async (req, res) => {
  const userId = req.user._id;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, contactSchema);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts(
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  );

  res.status(200).json({
    status: 200,
    data: contacts,
    message: 'Successfully found contacts!',
  });
};

export const getContactByIdController = async (req, res, next) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  const contact = await getContactById(userId, contactId);

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
  const contact = await createContact({ userId: req.user._id, ...req.body });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const contact = await deleteContact(userId, contactId);

  if (!contact) {
    throw createHttpError(404, ERR_MSG[404]);
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const result = await updateContact(userId, contactId, req.body, {
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
  const userId = req.user._id;
  const { contactId } = req.params;

  const result = await updateContact(userId, contactId, req.body);

  if (!result) {
    throw createHttpError(404, ERR_MSG[404]);
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};
