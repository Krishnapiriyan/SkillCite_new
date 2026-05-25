/** API origin without /api suffix (e.g. https://api.example.com) */
export function getApiOrigin() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  return apiUrl.replace(/\/api\/?$/, '');
}

export function getMockUploadUrl(filename) {
  return `${getApiOrigin()}/mock-uploads/${filename}`;
}
