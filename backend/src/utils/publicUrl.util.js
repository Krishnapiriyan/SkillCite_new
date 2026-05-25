import env from '../config/env.js';

/** Public backend origin without trailing slash */
export function getPublicApiOrigin() {
  if (env.PUBLIC_API_URL) {
    return env.PUBLIC_API_URL.replace(/\/$/, '');
  }
  const port = env.PORT || 3001;
  return `http://localhost:${port}`;
}

/** Turn stored upload URLs into browser-loadable public URLs */
export function toPublicAssetUrl(url) {
  if (!url || typeof url !== 'string') return url;

  const filename = url.includes('/mock-uploads/')
    ? url.split('/mock-uploads/').pop()?.split('?')[0]
    : url.includes('r2.cloudflarestorage.com')
      ? url.split('/').pop()?.split('?')[0]
      : null;

  if (filename) {
    return `${getPublicApiOrigin()}/mock-uploads/${filename}`;
  }

  return url;
}
