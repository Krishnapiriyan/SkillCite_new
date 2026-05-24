import { Router } from 'express';
import { login, refresh, logout, loginSchema, updateProfile, updateProfileSchema } from './auth.controller.js';
import { validate } from '../../../middlewares/validate.middleware.js';
import { verifyAdminToken } from '../../../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.put('/profile', verifyAdminToken, validate(updateProfileSchema), updateProfile);

export default router;
