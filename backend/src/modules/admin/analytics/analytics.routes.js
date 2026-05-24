import { Router } from 'express';
import { getOverview, getSubmissionsTrend, getSpecialtySplit } from './analytics.controller.js';
import { verifyAdminToken } from '../../../middlewares/auth.middleware.js';

const router = Router();

router.get('/overview', verifyAdminToken, getOverview);
router.get('/submissions-trend', verifyAdminToken, getSubmissionsTrend);
router.get('/specialty-split', verifyAdminToken, getSpecialtySplit);

export default router;
