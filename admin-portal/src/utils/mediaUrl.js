const getApiOrigin = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  return apiUrl.replace(/\/api\/?$/, '');
};

export function resolveMediaUrl(url) {
  if (!url || typeof url !== 'string') return url;

  if (url.includes('/mock-uploads/')) {
    const filename = url.split('/mock-uploads/').pop()?.split('?')[0];
    if (filename) return `${getApiOrigin()}/mock-uploads/${filename}`;
  }

  if (url.includes('localhost') || url.includes('r2.cloudflarestorage.com')) {
    return url.replace(/^https?:\/\/[^/]+/, getApiOrigin());
  }

  return url;
}
