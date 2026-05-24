import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL,
  timeout: 30000,
});

// 1. Submit Employer Request (handles multipart-form metadata + files)
export const submitEmployerRequestApi = async (formData) => {
  const response = await api.post('/employers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 2. Submit Candidate CV (handles multipart resume file)
export const submitCandidateCvApi = async (formData) => {
  const response = await api.post('/candidates', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 3. Submit Engineering Request (handles multiple project specifications files)
export const submitEngineeringRequestApi = async (formData) => {
  const response = await api.post('/engineering', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 4. Submit General Contact Message
export const submitContactMessageApi = async (data) => {
  const response = await api.post('/contacts', data);
  return response.data;
};

// 5. Send message to AI chatbot
export const sendChatbotMessageApi = async (messages) => {
  const response = await api.post('/chatbot/message', { messages });
  return response.data;
};

// 6. Fetch CMS content
export const fetchCmsContentApi = async () => {
  const response = await api.get('/cms');
  return response.data;
};

export default api;
