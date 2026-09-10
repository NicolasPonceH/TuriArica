import { createContext, useContext, useState, useCallback } from 'react';
import { ADMIN_PASSWORD } from '../utils/constants';
import { STORAGE_KEYS, getStoredData, setStoredData, removeStoredData } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return getStoredData(STORAGE_KEYS.ADMIN_AUTH) === true;
  });

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setStoredData(STORAGE_KEYS.ADMIN_AUTH, true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    removeStoredData(STORAGE_KEYS.ADMIN_AUTH);
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
