import { saveEmployerRequest, getEmployerRequests, getEmployerRequestById } from './employer.repository.js';
import { uploadToR2 } from '../../utils/r2.util.js';
import { sendEmployerConfirmation, sendAdminAlert } from '../../utils/brevo.util.js';

export const createEmployerRequest = async (body, files) => {
  // 1. Upload files to R2
  const uploadedFiles = await Promise.all(
    (files || []).map(f => uploadToR2(f.buffer, f.originalname, f.mimetype))
  );

  // 2. Save to DB
  const request = await saveEmployerRequest(body, uploadedFiles);

  // 3. Send confirmation email to employer
  try {
    const contactName = body.contactPerson || `${body.contactFirstName || ''} ${body.contactLastName || ''}`.trim() || 'Employer';
    const emailToUse = body.email || body.workEmail;
    const companyToUse = body.companyName || body.company || 'Company';
    await sendEmployerConfirmation(emailToUse, contactName, companyToUse);
  } catch (err) {
    console.error('Failed to send employer confirmation email:', err.message);
  }

  // 4. Alert admin
  try {
    const companyToUse = body.companyName || body.company || 'Company';
    const emailToUse = body.email || body.workEmail;
    await sendAdminAlert('employer request', companyToUse, emailToUse);
  } catch (err) {
    console.error('Failed to send admin alert email:', err.message);
  }

  return request;
};

export const fetchEmployerRequests = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return getEmployerRequests(skip, limit);
};

export const fetchEmployerRequestById = async (id) => {
  const request = await getEmployerRequestById(id);
  if (!request) {
    const error = new Error('Employer request not found');
    error.statusCode = 404;
    throw error;
  }
  return request;
};
