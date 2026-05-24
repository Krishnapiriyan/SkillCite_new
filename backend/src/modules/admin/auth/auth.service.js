import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../config/database.js';
import env from '../../../config/env.js';

export const loginAdmin = async (email, password) => {
  const admin = await prisma.admin.findUnique({
    where: { email }
  });

  if (!admin) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const payload = { id: admin.id, email: admin.email, name: admin.name };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

  return {
    accessToken,
    refreshToken,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name
    }
  };
};

export const refreshAdminToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    const payload = { id: decoded.id, email: decoded.email, name: decoded.name };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    const newRefreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }
};

export const updateAdminProfile = async (adminId, { name, email, password }) => {
  if (email) {
    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing && existing.id !== adminId) {
      const error = new Error('Email is already in use by another administrator');
      error.statusCode = 400;
      throw error;
    }
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  const updatedAdmin = await prisma.admin.update({
    where: { id: adminId },
    data: updateData
  });

  const payload = { id: updatedAdmin.id, email: updatedAdmin.email, name: updatedAdmin.name };

  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });

  return {
    accessToken,
    refreshToken,
    admin: {
      id: updatedAdmin.id,
      email: updatedAdmin.email,
      name: updatedAdmin.name
    }
  };
};
