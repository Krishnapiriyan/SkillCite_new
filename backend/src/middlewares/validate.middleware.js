import { errorResponse } from '../utils/response.util.js';

export const validate = (schema) => (req, res, next) => {
  try {
    // Smart pre-parsing for multipart/form-data strings
    if (typeof req.body.requiredSkills === 'string') {
      try {
        req.body.requiredSkills = JSON.parse(req.body.requiredSkills);
      } catch (e) {
        req.body.requiredSkills = req.body.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    
    if (typeof req.body.skills === 'string') {
      try {
        req.body.skills = JSON.parse(req.body.skills);
      } catch (e) {
        req.body.skills = req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    
    if (typeof req.body.employmentType === 'string') {
      try {
        req.body.employmentType = JSON.parse(req.body.employmentType);
      } catch (e) {
        req.body.employmentType = req.body.employmentType.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    if (typeof req.body.careerGoals === 'string') {
      try {
        req.body.careerGoals = JSON.parse(req.body.careerGoals);
      } catch (e) {
        req.body.careerGoals = req.body.careerGoals.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    
    if (typeof req.body.teamSize === 'string') {
      const val = parseInt(req.body.teamSize, 10);
      req.body.teamSize = isNaN(val) ? null : val;
    }
    
    if (typeof req.body.yearsExperience === 'string') {
      const val = parseInt(req.body.yearsExperience, 10);
      req.body.yearsExperience = isNaN(val) ? 0 : val;
    }

    const validated = schema.parse(req.body);
    req.body = validated;
    next();
  } catch (err) {
    const errorMsg = err.errors 
      ? err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ') 
      : err.message;
    const error = new Error(errorMsg);
    error.statusCode = 400;
    return errorResponse(res, error);
  }
};
