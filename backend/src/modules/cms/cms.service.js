import { getAllSiteContent, getSiteContentByKey, updateSiteContentByKey } from './cms.repository.js';

export const fetchAllCmsContent = async () => {
  const contents = await getAllSiteContent();
  // Transform list of { key, value } to a single dictionary { [key]: value } for easier frontend ingestion
  const dictionary = {};
  contents.forEach(item => {
    dictionary[item.key] = item.value;
  });
  return dictionary;
};

export const fetchCmsValue = async (key) => {
  const record = await getSiteContentByKey(key);
  return record ? record.value : null;
};

export const saveCmsContent = async (key, value) => {
  return updateSiteContentByKey(key, value);
};
