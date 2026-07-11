import { createCandidateSubmission, fetchCandidateSubmissions, fetchCandidateSubmissionById } from './candidate.service.js';
import { markCandidateRead } from './candidate.repository.js';
import { successResponse, errorResponse } from '../../utils/response.util.js';
import { z } from 'zod';

export const candidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().optional().or(z.literal('')).or(z.null()),
  nationality: z.string().optional().or(z.literal('')).or(z.null()),
  rightToWork: z.string().optional().or(z.literal('')).or(z.null()),
  specialty: z.string().optional().or(z.literal('')).or(z.null()),
  preferredRole: z.string().optional().or(z.literal('')).or(z.null()),
  skills: z.array(z.string()).default([]),
  experienceLevel: z.string().optional().or(z.literal('')).or(z.null()),
  yearsExperience: z.number().nonnegative().default(0).optional(),
  employmentStatus: z.string().optional().or(z.literal('')).or(z.null()),
  linkedIn: z.string().url().optional().or(z.literal('')).or(z.null()),
  portfolio: z.string().url().optional().or(z.literal('')).or(z.null()),
  github: z.string().url().optional().or(z.literal('')).or(z.null()),
  coverNote: z.string().max(300, 'Cover note cannot exceed 300 characters').optional().or(z.literal('')).or(z.null()),

  // New u&u fields
  state: z.string().min(1, 'State is required'),
  careerExperience: z.string().min(1, 'Career experience is required'),
  careerGoals: z.array(z.string()).default([]),
  preferredCommunication: z.string().min(1, 'Preferred communication is required'),
});

export const submitCandidateCV = async (req, res) => {
  try {
    const data = await createCandidateSubmission(req.body, req.files);
    return successResponse(res, 201, 'Candidate resume submitted successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const listCandidateSubmissions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const data = await fetchCandidateSubmissions(page, limit);
    return successResponse(res, 200, 'Candidate submissions retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getSingleCandidateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchCandidateSubmissionById(id);
    return successResponse(res, 200, 'Candidate details retrieved successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const toggleCandidateRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    const data = await markCandidateRead(id, isRead);
    return successResponse(res, 200, 'Read status updated', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};
