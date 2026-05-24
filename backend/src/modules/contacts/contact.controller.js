import { createContactMessage, fetchContactMessages, fetchContactMessageById } from './contact.service.js';
import { successResponse, errorResponse } from '../../utils/response.util.js';
import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  enquiryType: z.string().min(1, 'Enquiry type is required'),
  message: z.string().min(1, 'Message is required'),
});

export const submitContactMessage = async (req, res) => {
  try {
    const data = await createContactMessage(req.body);
    return successResponse(res, 201, 'Contact message submitted successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const listContactMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const data = await fetchContactMessages(page, limit);
    return successResponse(res, 200, 'Contact messages retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getSingleContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchContactMessageById(id);
    return successResponse(res, 200, 'Contact message details retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};
