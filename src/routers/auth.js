import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema } from '../validation/user.js';

const router = new Router();

router.post('/auth/register', validateBody(registerUserSchema), ctrlWrapper());

export default router;
