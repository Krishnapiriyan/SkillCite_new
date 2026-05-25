import { getAllSiteContent, getSiteContentByKey, updateSiteContentByKey } from './cms.repository.js';
import { toPublicAssetUrl } from '../../utils/publicUrl.util.js';

const normalizeCmsValue = (key, value) => {
  if (typeof value !== 'string') return value;
  if (key.endsWith('videoUrl') || key.endsWith('Url') || value.includes('/mock-uploads/')) {
    return toPublicAssetUrl(value);
  }
  return value;
};

export const fetchAllCmsContent = async () => {
  const contents = await getAllSiteContent();
  const dictionary = {};
  for (const item of contents) {
    const normalized = normalizeCmsValue(item.key, item.value);
    if (normalized !== item.value) {
      updateSiteContentByKey(item.key, normalized).catch((err) => {
        console.warn(`[CMS] Could not persist normalized URL for ${item.key}:`, err.message);
      });
    }
    dictionary[item.key] = normalized;
  }
  return dictionary;
};

export const fetchCmsValue = async (key) => {
  const record = await getSiteContentByKey(key);
  return record ? record.value : null;
};

export const saveCmsContent = async (key, value) => {
  const normalized = normalizeCmsValue(key, value);
  return updateSiteContentByKey(key, normalized);
};
