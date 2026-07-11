import { Router } from 'express';
import { submitCandidateCV, listCandidateSubmissions, getSingleCandidateSubmission, candidateSchema, toggleCandidateRead } from './candidate.controller.js';
import { upload } from '../../middlewares/upload.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { rateLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { verifyAdminToken } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public route for resume upload
router.post('/', rateLimiter, upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'coverLetter', maxCount: 1 }]), validate(candidateSchema), submitCandidateCV);

// Admin routes
router.get('/admin', verifyAdminToken, listCandidateSubmissions);
router.get('/admin/:id', verifyAdminToken, getSingleCandidateSubmission);
router.patch('/admin/:id/read', verifyAdminToken, toggleCandidateRead);

export default router;
