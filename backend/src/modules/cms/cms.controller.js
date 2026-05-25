import { fetchAllCmsContent, saveCmsContent } from './cms.service.js';
import { successResponse, errorResponse } from '../../utils/response.util.js';
import { uploadToR2 } from '../../utils/r2.util.js';

export const getCmsContent = async (req, res) => {
  try {
    const data = await fetchAllCmsContent();
    return successResponse(res, 200, 'CMS content fetched successfully', data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const updateCmsContent = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (typeof value !== 'string') {
      const err = new Error('CMS value must be a string');
      err.statusCode = 400;
      throw err;
    }

    const data = await saveCmsContent(key, value);
    return successResponse(res, 200, `CMS key '${key}' updated successfully`, data);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const uploadCmsFile = async (req, res) => {
  try {
    if (!req.file) {
      const err = new Error('No file uploaded');
      err.statusCode = 400;
      throw err;
    }

    const result = await uploadToR2(req.file.buffer, req.file.originalname, req.file.mimetype);
    return successResponse(res, 200, 'CMS file uploaded successfully', {
      url: result.url,
      key: result.key,
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};
