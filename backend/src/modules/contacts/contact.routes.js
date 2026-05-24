import { Router } from 'express';
import { submitContactMessage, listContactMessages, getSingleContactMessage, contactSchema } from './contact.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { rateLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { verifyAdminToken } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public route for contact message
router.post('/', rateLimiter, validate(contactSchema), submitContactMessage);

// Admin routes
router.get('/admin', verifyAdminToken, listContactMessages);
router.get('/admin/:id', verifyAdminToken, getSingleContactMessage);

export default router;
