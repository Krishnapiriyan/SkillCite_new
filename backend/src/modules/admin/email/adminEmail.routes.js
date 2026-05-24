import { Router } from 'express';
import { sendAdminComposeEmail, manualEmailSchema } from './adminEmail.controller.js';
import { validate } from '../../../middlewares/validate.middleware.js';
import { verifyAdminToken } from '../../../middlewares/auth.middleware.js';

const router = Router();

router.post('/send', verifyAdminToken, validate(manualEmailSchema), sendAdminComposeEmail);

export default router;
