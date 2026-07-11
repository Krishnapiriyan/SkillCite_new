import { Router } from 'express';
import { getOverview, getSubmissionsTrend, getSpecialtySplit, getNotificationCounts, markAllAsRead } from './analytics.controller.js';
import { verifyAdminToken } from '../../../middlewares/auth.middleware.js';

const router = Router();

router.get('/overview', verifyAdminToken, getOverview);
router.get('/submissions-trend', verifyAdminToken, getSubmissionsTrend);
router.get('/specialty-split', verifyAdminToken, getSpecialtySplit);
router.get('/notifications/counts', verifyAdminToken, getNotificationCounts);
router.post('/notifications/mark-all-read', verifyAdminToken, markAllAsRead);

export default router;
