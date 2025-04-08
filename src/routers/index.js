import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { rootController } from '../controllers/contacts.js';

const router = new Router();

router.get('/', ctrlWrapper(rootController));
router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
