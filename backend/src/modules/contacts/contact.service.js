import { saveContactMessage, getContactMessages, getContactMessageById } from './contact.repository.js';
import { sendContactConfirmation, sendAdminAlert } from '../../utils/brevo.util.js';

export const createContactMessage = async (body) => {
  // 1. Save to DB
  const contact = await saveContactMessage(body);

  // 2. Send confirmation email to user
  try {
    await sendContactConfirmation(body.email, body.fullName);
  } catch (err) {
    console.error('Failed to send contact confirmation email:', err.message);
  }

  // 3. Alert admin
  try {
    await sendAdminAlert('contact query', body.fullName, body.email);
  } catch (err) {
    console.error('Failed to send admin alert email:', err.message);
  }

  return contact;
};

export const fetchContactMessages = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return getContactMessages(skip, limit);
};

export const fetchContactMessageById = async (id) => {
  const contact = await getContactMessageById(id);
  if (!contact) {
    const error = new Error('Contact message not found');
    error.statusCode = 404;
    throw error;
  }
  return contact;
};
