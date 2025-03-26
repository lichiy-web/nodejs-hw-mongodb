import Router from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  rootController,
} from '../controllers/contacts.js';

const router = new Router();

router.get('/', rootController);

router.get('/contacts', getAllContactsController);

router.get('/contacts/:contactId', getContactByIdController);

export default router;
