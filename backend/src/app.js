import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, isR2Configured } from './config/r2.js';
import env from './config/env.js';

// Import Routers
import cmsRouter from './modules/cms/cms.routes.js';
import employerRouter from './modules/employers/employer.routes.js';
import candidateRouter from './modules/candidates/candidate.routes.js';
import engineeringRouter from './modules/engineering/engineering.routes.js';
import contactRouter from './modules/contacts/contact.routes.js';
import chatbotRouter from './modules/chatbot/chatbot.routes.js';
import adminAuthRouter from './modules/admin/auth/auth.routes.js';
import adminEmailRouter from './modules/admin/email/adminEmail.routes.js';
import adminAnalyticsRouter from './modules/admin/analytics/analytics.routes.js';

// Import Specific Controllers for Admin routes direct mounting
import { listEmployerRequests, getSingleEmployerRequest } from './modules/employers/employer.controller.js';
import { listCandidateSubmissions, getSingleCandidateSubmission } from './modules/candidates/candidate.controller.js';
import { listEngineeringRequests, getSingleEngineeringRequest } from './modules/engineering/engineering.controller.js';
import { listContactMessages, getSingleContactMessage } from './modules/contacts/contact.controller.js';
import { getCmsContent, updateCmsContent, uploadCmsFile } from './modules/cms/cms.controller.js';
import { verifyAdminToken } from './middlewares/auth.middleware.js';
import { upload } from './middlewares/upload.middleware.js';

const app = express();

// CORS config
const allowedOrigins = env.CORS_ORIGINS.split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SkillCite API is running',
    docs: 'Use /api/* endpoints (e.g. GET /api/cms)',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok' });
});

// Serve local uploaded files or dynamically stream from R2 bucket in authenticated mode (Proxy)
app.get('/mock-uploads/:filename', async (req, res, next) => {
  try {
    const { filename } = req.params;
    const localFilePath = path.resolve('public/mock-uploads', filename);

    // 1. If it exists in local mock directory, serve it statically
    if (fs.existsSync(localFilePath)) {
      return res.sendFile(localFilePath);
    }

    // 2. Otherwise, fetch from secure private R2 bucket using server-side credentials and stream to browser
    if (isR2Configured && r2Client) {
      const key = `uploads/${filename}`;
      const response = await r2Client.send(new GetObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key
      }));

      res.setHeader('Content-Type', response.ContentType || 'application/octet-stream');
      if (response.ContentLength) {
        res.setHeader('Content-Length', response.ContentLength);
      }
      res.setHeader('Cache-Control', 'public, max-age=31536000');

      return response.Body.pipe(res);
    }

    return res.status(404).json({ success: false, error: 'File not found' });
  } catch (err) {
    console.error(`[R2 PROXY ERROR] Failed to stream filename '${req.params.filename}' from R2:`, err.message);
    return res.status(404).json({ success: false, error: 'File not found' });
  }
});

// Public Endpoints
app.use('/api/cms', cmsRouter);
app.use('/api/employers', employerRouter);
app.use('/api/candidates', candidateRouter);
app.use('/api/engineering', engineeringRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/chatbot', chatbotRouter);

// Admin-specific Endpoints
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/email', adminEmailRouter);
app.use('/api/admin/analytics', adminAnalyticsRouter);

// Admin Resource Mappings (Matching Section 7)
app.get('/api/admin/employers', verifyAdminToken, listEmployerRequests);
app.get('/api/admin/employers/:id', verifyAdminToken, getSingleEmployerRequest);

app.get('/api/admin/candidates', verifyAdminToken, listCandidateSubmissions);
app.get('/api/admin/candidates/:id', verifyAdminToken, getSingleCandidateSubmission);

app.get('/api/admin/engineering', verifyAdminToken, listEngineeringRequests);
app.get('/api/admin/engineering/:id', verifyAdminToken, getSingleEngineeringRequest);

app.get('/api/admin/contacts', verifyAdminToken, listContactMessages);
app.get('/api/admin/contacts/:id', verifyAdminToken, getSingleContactMessage);

app.get('/api/admin/cms', verifyAdminToken, getCmsContent);
app.put('/api/admin/cms/:key', verifyAdminToken, updateCmsContent);
app.post('/api/admin/cms/upload', verifyAdminToken, upload.single('file'), uploadCmsFile);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

export default app;
