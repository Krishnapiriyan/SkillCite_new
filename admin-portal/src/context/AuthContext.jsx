import { createContext, useState, useEffect, useContext } from 'react';
import { adminLoginApi, adminLogoutApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('adminToken');
      const savedAdmin = localStorage.getItem('adminUser');
      if (savedToken && savedAdmin) {
        try {
          setAdmin(JSON.parse(savedAdmin));
        } catch (e) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminRefreshToken');
          localStorage.removeItem('adminUser');
        }
      }
    } catch (err) {
      console.warn('Failed to access local session storage on mount:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await adminLoginApi(email, password);
    if (res.success && res.data) {
      const { accessToken, refreshToken, admin: user } = res.data;
      localStorage.setItem('adminToken', accessToken);
      localStorage.setItem('adminRefreshToken', refreshToken);
      localStorage.setItem('adminUser', JSON.stringify(user));
      setAdmin(user);
      return user;
    }
    throw new Error(res.error || 'Login failed');
  };

  const logout = async () => {
    try {
      await adminLogoutApi();
    } catch (e) {
      console.warn('Network logout failed, clearing local session anyway');
    }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminUser');
    setAdmin(null);
  };

  const updateAdminUser = (user, accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem('adminToken', accessToken);
    if (refreshToken) localStorage.setItem('adminRefreshToken', refreshToken);
    if (user) {
      localStorage.setItem('adminUser', JSON.stringify(user));
      setAdmin(user);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, updateAdminUser, isAuthenticated: !!admin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}
export default AuthContext;
