import { createEngineeringRequest, fetchEngineeringRequests, fetchEngineeringRequestById } from './engineering.service.js';
import { markEngineeringRead } from './engineering.repository.js';
import { successResponse, errorResponse } from '../../utils/response.util.js';
import { z } from 'zod';

export const engineeringSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  company: z.string().optional().or(z.literal('')).or(z.null()),
  serviceType: z.enum(['autocad', 'estimation', 'calculations', 'consultation']),
  description: z.string().min(1, 'Project description is required'),
  deadline: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid deadline date' }),
  budget: z.string().optional().or(z.literal('')).or(z.null()),
});

export const submitEngineeringRequest = async (req, res) => {
  try {
    const data = await createEngineeringRequest(req.body, req.files);
    return successResponse(res, 201, 'Engineering service request submitted successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const listEngineeringRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const data = await fetchEngineeringRequests(page, limit);
    return successResponse(res, 200, 'Engineering requests retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getSingleEngineeringRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchEngineeringRequestById(id);
    return successResponse(res, 200, 'Engineering request details retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const toggleEngineeringRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const data = await markEngineeringRead(id, isRead);
    return successResponse(res, 200, 'Read status updated', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};
