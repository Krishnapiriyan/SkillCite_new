import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL,
  timeout: 30000,
});

// Interceptor to inject bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 token refresh retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const localRefresh = localStorage.getItem('adminRefreshToken');
        if (!localRefresh) throw new Error('No refresh token locally');

        const res = await axios.post(`${baseURL}/admin/auth/refresh`, {
          refreshToken: localRefresh
        });
        
        if (res.data?.success && res.data?.data) {
          const { accessToken, refreshToken } = res.data.data;
          localStorage.setItem('adminToken', accessToken);
          if (refreshToken) {
            localStorage.setItem('adminRefreshToken', refreshToken);
          }
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error('Auto-refresh token failed:', err.message);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Admin Auth APIs
export const adminLoginApi = async (email, password) => {
  const res = await api.post('/admin/auth/login', { email, password });
  return res.data;
};

export const adminLogoutApi = async () => {
  const res = await api.post('/admin/auth/logout');
  return res.data;
};

export const updateAdminProfileApi = async (data) => {
  const res = await api.put('/admin/auth/profile', data);
  return res.data;
};

// Admin Resources APIs
export const getEmployersApi = async (page = 1, limit = 20) => {
  const res = await api.get(`/admin/employers?page=${page}&limit=${limit}`);
  return res.data;
};

export const getEmployerByIdApi = async (id) => {
  const res = await api.get(`/admin/employers/${id}`);
  return res.data;
};

export const getCandidatesApi = async (page = 1, limit = 20) => {
  const res = await api.get(`/admin/candidates?page=${page}&limit=${limit}`);
  return res.data;
};

export const getCandidateByIdApi = async (id) => {
  const res = await api.get(`/admin/candidates/${id}`);
  return res.data;
};

export const getEngineeringRequestsApi = async (page = 1, limit = 20) => {
  const res = await api.get(`/admin/engineering?page=${page}&limit=${limit}`);
  return res.data;
};

export const getEngineeringByIdApi = async (id) => {
  const res = await api.get(`/admin/engineering/${id}`);
  return res.data;
};

export const getContactsApi = async (page = 1, limit = 20) => {
  const res = await api.get(`/admin/contacts?page=${page}&limit=${limit}`);
  return res.data;
};

export const getContactByIdApi = async (id) => {
  const res = await api.get(`/admin/contacts/${id}`);
  return res.data;
};

// Manual Email Compose Sender
export const sendAdminEmailApi = async (to, subject, body) => {
  const res = await api.post('/admin/email/send', { to, subject, body });
  return res.data;
};

// CMS Key-Value APIs
export const getCmsContentApi = async () => {
  const res = await api.get('/admin/cms');
  return res.data;
};

export const updateCmsContentApi = async (key, value) => {
  const res = await api.put(`/admin/cms/${key}`, { value });
  return res.data;
};

export const uploadCmsFileApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/admin/cms/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Analytics & Trends APIs
export const getAnalyticsOverviewApi = async () => {
  const res = await api.get('/admin/analytics/overview');
  return res.data;
};

export const getAnalyticsTrendApi = async () => {
  const res = await api.get('/admin/analytics/submissions-trend');
  return res.data;
};

export const getAnalyticsSpecialtyApi = async () => {
  const res = await api.get('/admin/analytics/specialty-split');
  return res.data;
};

export default api;
