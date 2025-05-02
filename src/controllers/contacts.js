import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { RES_MSG } from '../constants/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { contactSchema } from '../db/models/contact.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileAndGetUrl } from '../utils/saveFileAndGetUrl.js';

export const rootController = (req, res) => {
  res.json({
    availableRoutes: [
      '/',
      '/contacts',
      '/contacts/:contactId',
      '/auth/register',
      '/auth/login',
      '/auth/logout',
      '/auth/refresh',
      '/auth/send-reset-email',
      '/auth/reset-pwd',
      '/auth/get-oauth-url',
      '/auth/confirm-oauth',
      '/uploads',
      '/api-docs',
    ],
    availableQueries: {
      get: [
        '/',
        '/contacts',
        '/contacts?page={number}&perPage={number}&sortBy={contactFieldName}&sortOrder={asc|desc}&type={personal|home|work}l&isFavourite={true|false}',
        '/contacts/:contactId',
        '/auth/get-oauth-url',
        '/uploads',
      ],
      post: [
        '/contacts/:contactId',
        '/auth/register',
        '/auth/login',
        '/auth/logout',
        '/auth/refresh',
        '/send-reset-email',
        '/reset-pwd',
        '/auth/register',
        '/auth/login',
        '/auth/logout',
        '/auth/refresh',
        '/auth/send-reset-email',
        '/auth/reset-pwd',
        '/auth/confirm-oauth',
      ],
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
    message: RES_MSG[200].getAllContacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  const contact = await getContactById(userId, contactId);

  if (!contact) {
    throw createHttpError(404, RES_MSG[404].noContact);
  }

  res.status(200).json({
    status: 200,
    data: contact,
    message: `${RES_MSG[200].getContactById} ${contactId}`,
  });
};

export const createContactController = async (req, res) => {
  const photoUrl = await saveFileAndGetUrl(req.file);
  const contact = await createContact({
    userId: req.user._id,
    ...req.body,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: RES_MSG[201].createContact,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const contact = await deleteContact(userId, contactId);

  if (!contact) {
    throw createHttpError(404, RES_MSG[404].noContact);
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;
  const photoUrl = await saveFileAndGetUrl(req.file);

  const result = await updateContact(
    userId,
    contactId,
    {
      ...req.body,
      photo: photoUrl,
    },
    {
      upsert: true,
    },
  );

  if (!result) {
    throw createHttpError(404, RES_MSG[404].noContact);
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: RES_MSG[status].upsertContact,
    data: result.contact,
  });
};

export const patchContactController = async (req, res) => {
  const userId = req.user._id;
  const { contactId } = req.params;

  const photoUrl = await saveFileAndGetUrl(req.file);
  const result = await updateContact(userId, contactId, {
    ...req.body,
    photo: photoUrl,
  });

  if (!result) {
    throw createHttpError(404, RES_MSG[404].noContact);
  }

  res.json({
    status: 200,
    message: RES_MSG[200].patchContact,
    data: result.contact,
  });
};
