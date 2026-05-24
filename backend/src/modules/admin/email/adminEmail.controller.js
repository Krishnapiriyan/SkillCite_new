import { sendManualEmail } from '../../../utils/brevo.util.js';
import { successResponse, errorResponse } from '../../../utils/response.util.js';
import { z } from 'zod';

export const manualEmailSchema = z.object({
  to: z.string().email('Invalid recipient email address'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Message body is required'),
});

export const sendAdminComposeEmail = async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    await sendManualEmail(to, subject, body);
    return successResponse(res, 200, 'Email sent successfully via Brevo');
  } catch (error) {
    return errorResponse(res, error);
  }
};
