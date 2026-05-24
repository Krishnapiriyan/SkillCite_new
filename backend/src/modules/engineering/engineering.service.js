import { saveEngineeringRequest, getEngineeringRequests, getEngineeringRequestById } from './engineering.repository.js';
import { uploadToR2 } from '../../utils/r2.util.js';
import { sendEngineeringConfirmation, sendAdminAlert } from '../../utils/brevo.util.js';

export const createEngineeringRequest = async (body, files) => {
  // 1. Upload files to R2
  const uploadedFiles = await Promise.all(
    (files || []).map(f => uploadToR2(f.buffer, f.originalname, f.mimetype))
  );

  // 2. Save to DB
  const request = await saveEngineeringRequest(body, uploadedFiles);

  // 3. Send confirmation email to client
  try {
    await sendEngineeringConfirmation(body.email, body.fullName, body.serviceType);
  } catch (err) {
    console.error('Failed to send engineering confirmation email:', err.message);
  }

  // 4. Alert admin
  try {
    await sendAdminAlert('engineering request', body.fullName, body.email);
  } catch (err) {
    console.error('Failed to send admin alert email:', err.message);
  }

  return request;
};

export const fetchEngineeringRequests = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return getEngineeringRequests(skip, limit);
};

export const fetchEngineeringRequestById = async (id) => {
  const request = await getEngineeringRequestById(id);
  if (!request) {
    const error = new Error('Engineering request not found');
    error.statusCode = 404;
    throw error;
  }
  return request;
};
