import { Router } from 'express';
import { submitEmployerRequest, listEmployerRequests, getSingleEmployerRequest, employerRequestSchema } from './employer.controller.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { rateLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { verifyAdminToken } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public route for submissions
router.post('/', rateLimiter, upload.array('files', 3), validate(employerRequestSchema), submitEmployerRequest);

// Admin routes (mounted under /api/admin/employers or mounted here and verified)
router.get('/admin', verifyAdminToken, listEmployerRequests);
router.get('/admin/:id', verifyAdminToken, getSingleEmployerRequest);

export default router;
