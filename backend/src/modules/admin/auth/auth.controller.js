import { loginAdmin, refreshAdminToken, updateAdminProfile } from './auth.service.js';
import { successResponse, errorResponse } from '../../../utils/response.util.js';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const getCookie = (req, name) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(';').reduce((acc, c) => {
    const parts = c.split('=');
    const key = parts[0]?.trim();
    const val = parts.slice(1).join('=')?.trim();
    if (key) acc[key] = val;
    return acc;
  }, {});
  return cookies[name] || null;
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await loginAdmin(email, password);

    // Set refresh token in httpOnly cookie for extra security in browsers
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, 200, 'Login successful', {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken, // Also returning in body for easy handling
      admin: data.admin,
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || getCookie(req, 'refreshToken');
    if (!refreshToken) {
      const error = new Error('Refresh token is required');
      error.statusCode = 401;
      throw error;
    }

    const data = await refreshAdminToken(refreshToken);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    return successResponse(res, 200, 'Token refreshed successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  return successResponse(res, 200, 'Logout successful');
};

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
});

export const updateProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { name, email, password } = req.body;
    const cleanFields = { name, email };
    if (password && password.trim().length >= 6) {
      cleanFields.password = password;
    }

    const data = await updateAdminProfile(adminId, cleanFields);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 200, 'Profile updated successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};
