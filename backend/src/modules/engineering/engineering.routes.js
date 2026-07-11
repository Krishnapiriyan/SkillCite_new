import { Router } from 'express';
import { submitEngineeringRequest, listEngineeringRequests, getSingleEngineeringRequest, engineeringSchema, toggleEngineeringRead } from './engineering.controller.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { rateLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { verifyAdminToken } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public route for engineering submission
router.post('/', rateLimiter, upload.array('files', 5), validate(engineeringSchema), submitEngineeringRequest);

// Admin routes
router.get('/admin', verifyAdminToken, listEngineeringRequests);
router.get('/admin/:id', verifyAdminToken, getSingleEngineeringRequest);
router.patch('/admin/:id/read', verifyAdminToken, toggleEngineeringRead);

export default router;
