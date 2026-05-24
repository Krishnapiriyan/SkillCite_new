import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { errorResponse } from '../utils/response.util.js';

export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Authorization token required');
    error.statusCode = 401;
    return errorResponse(res, error);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    const error = new Error('Invalid or expired authorization token');
    error.statusCode = 401;
    return errorResponse(res, error);
  }
};
