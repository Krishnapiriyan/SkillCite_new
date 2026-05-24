import { Router } from 'express';
import { getCmsContent, updateCmsContent, uploadCmsFile } from './cms.controller.js';
import { verifyAdminToken } from '../../middlewares/auth.middleware.js';
import { upload } from '../../middlewares/upload.middleware.js';

const router = Router();

// Public route
router.get('/', getCmsContent);

// Admin protected routes
router.get('/admin', verifyAdminToken, getCmsContent);
router.put('/admin/:key', verifyAdminToken, updateCmsContent);
router.post('/admin/upload', verifyAdminToken, upload.single('file'), uploadCmsFile);

export default router;
