import { saveCandidateSubmission, getCandidateSubmissions, getCandidateSubmissionById } from './candidate.repository.js';
import { uploadToR2 } from '../../utils/r2.util.js';
import { sendCandidateConfirmation, sendAdminAlert } from '../../utils/brevo.util.js';

export const createCandidateSubmission = async (body, files) => {
  // 1. Upload resume and cover letter files to R2 if provided
  let uploadedResume = null;
  let uploadedCoverLetter = null;

  const resumeFile = files && files.resume ? files.resume[0] : null;
  const coverLetterFile = files && files.coverLetter ? files.coverLetter[0] : null;

  if (resumeFile) {
    uploadedResume = await uploadToR2(resumeFile.buffer, resumeFile.originalname, resumeFile.mimetype);
  }
  if (coverLetterFile) {
    uploadedCoverLetter = await uploadToR2(coverLetterFile.buffer, coverLetterFile.originalname, coverLetterFile.mimetype);
  }

  // 2. Save to DB
  const submission = await saveCandidateSubmission(body, uploadedResume, uploadedCoverLetter);

  const fullName = `${body.firstName} ${body.lastName}`;

  // 3. Send confirmation email to candidate
  try {
    await sendCandidateConfirmation(body.email, fullName);
  } catch (err) {
    console.error('Failed to send candidate confirmation email:', err.message);
  }

  // 4. Alert admin
  try {
    await sendAdminAlert('candidate submission', fullName, body.email);
  } catch (err) {
    console.error('Failed to send admin alert email:', err.message);
  }

  return submission;
};

export const fetchCandidateSubmissions = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  return getCandidateSubmissions(skip, limit);
};

export const fetchCandidateSubmissionById = async (id) => {
  const submission = await getCandidateSubmissionById(id);
  if (!submission) {
    const error = new Error('Candidate submission not found');
    error.statusCode = 404;
    throw error;
  }
  return submission;
};
