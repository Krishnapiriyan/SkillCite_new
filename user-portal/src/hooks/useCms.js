import { useState, useEffect } from 'react';
import { fetchCmsContentApi } from '../services/api.js';

export default function useCms() {
  const [cms, setCms] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCmsContentApi()
      .then(res => {
        if (res.success && res.data) {
          setCms(res.data);
        }
      })
      .catch(err => {
        console.error('Failed to load CMS content, using local client fallbacks:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getCms = (key, defaultValue = '') => {
    return cms[key] !== undefined ? cms[key] : defaultValue;
  };

  return { cms, getCms, loading, error };
}
