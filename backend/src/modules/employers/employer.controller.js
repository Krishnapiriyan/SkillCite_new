import { createEmployerRequest, fetchEmployerRequests, fetchEmployerRequestById } from './employer.service.js';
import { successResponse, errorResponse } from '../../utils/response.util.js';
import { z } from 'zod';

export const employerRequestSchema = z.object({
  companyName: z.string().optional().or(z.literal('')).or(z.null()),
  contactPerson: z.string().optional().or(z.literal('')).or(z.null()),
  email: z.string().optional().or(z.literal('')).or(z.null()),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().optional().or(z.literal('')).or(z.null()),
  website: z.string().url().optional().or(z.literal('')).or(z.null()),
  specialty: z.string().optional().or(z.literal('')).or(z.null()),
  requiredRole: z.string().optional().or(z.literal('')).or(z.null()),
  requiredSkills: z.array(z.string()).default([]),
  teamSize: z.number().nullable().optional(),
  experienceLevel: z.string().optional().or(z.literal('')).or(z.null()),
  employmentType: z.array(z.string()).default([]),
  projectType: z.string().nullable().optional(),
  description: z.string().optional().or(z.literal('')).or(z.null()),
  timeline: z.string().optional().or(z.literal('')).or(z.null()),
  budgetRange: z.string().nullable().optional(),

  // New u&u fields
  engagementNeed: z.string().min(1, 'Engagement need is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobLocation: z.string().min(1, 'Job location is required'),
  jobType: z.string().min(1, 'Job type is required'),
  contactFirstName: z.string().min(1, 'First name is required'),
  contactLastName: z.string().min(1, 'Last name is required'),
  company: z.string().min(1, 'Company is required'),
  state: z.string().min(1, 'State is required'),
  position: z.string().min(1, 'Position is required'),
  workEmail: z.string().email('Invalid work email address'),
});

export const submitEmployerRequest = async (req, res) => {
  try {
    const data = await createEmployerRequest(req.body, req.files);
    return successResponse(res, 201, 'Employer recruitment request submitted successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const listEmployerRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const data = await fetchEmployerRequests(page, limit);
    return successResponse(res, 200, 'Employer requests retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getSingleEmployerRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchEmployerRequestById(id);
    return successResponse(res, 200, 'Employer request details retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};
