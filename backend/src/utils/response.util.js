import { toPublicAssetUrl } from './publicUrl.util.js';

const rewritePrivateR2Urls = (obj) => {
  if (!obj) return obj;

  if (obj instanceof Date) {
    return obj;
  }

  if (typeof obj === 'string') {
    if (
      obj.includes('r2.cloudflarestorage.com') ||
      obj.includes('/mock-uploads/') ||
      obj.includes('localhost')
    ) {
      return toPublicAssetUrl(obj);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => rewritePrivateR2Urls(item));
  }

  if (typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = rewritePrivateR2Urls(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
};

export const successResponse = (res, status, message, data = null) => {
  const processedData = rewritePrivateR2Urls(data);
  return res.status(status).json({ success: true, message, data: processedData });
};

export const errorResponse = (res, error) => {
  const status = error.statusCode || 500;
  return res.status(status).json({ success: false, error: error.message || 'Server error' });
};
