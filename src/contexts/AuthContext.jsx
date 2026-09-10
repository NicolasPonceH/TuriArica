import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ADMIN_PASSWORD, API_BASE_URL } from '../utils/constants';
import { STORAGE_KEYS, getStoredData, setStoredData, removeStoredData } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return getStoredData(STORAGE_KEYS.ADMIN_AUTH) === true;
  });
  const [token, setToken] = useState(() => {
    return getStoredData(STORAGE_KEYS.ADMIN_TOKEN) || null;
  });
  const [adminUser, setAdminUser] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(true);

  // Check token validity with backend on mount
  useEffect(() => {
    async function verifySession() {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAdminUser(data.admin);
          setIsAdmin(true);
          setIsBackendConnected(true);
        } else {
          // Token expired
          logout();
        }
      } catch (err) {
        console.warn('[AUTH] No se pudo contactar al backend, operando en modo offline.');
        setIsBackendConnected(false);
      }
    }
    verifySession();
  }, [token]);

  const login = useCallback(async (username, password) => {
    // 1. Intentar autenticar contra el backend real
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username || 'admin', password })
      });

      if (res.ok) {
        const data = await res.json();
        setIsAdmin(true);
        setToken(data.token);
        setAdminUser(data.admin);
        setStoredData(STORAGE_KEYS.ADMIN_AUTH, true);
        setStoredData(STORAGE_KEYS.ADMIN_TOKEN, data.token);
        setIsBackendConnected(true);
        return { success: true };
      } else {
        const errorData = await res.json();
        return { success: false, error: errorData.error || 'Credenciales incorrectas.' };
      }
    } catch (err) {
      // 2. Fallback offline si el backend no está activo
      console.warn('[AUTH] Error al conectar con servidor backend, usando fallback local.');
      setIsBackendConnected(false);
      if (password === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setStoredData(STORAGE_KEYS.ADMIN_AUTH, true);
        setAdminUser({ username: username || 'admin', role: 'offline_admin' });
        return { success: true, offline: true };
      }
      return { success: false, error: 'Contraseña incorrecta o servidor no disponible.' };
    }
  }, []);

  const logout = useCallback(() => {
    setIsAdmin(false);
    setToken(null);
    setAdminUser(null);
    removeStoredData(STORAGE_KEYS.ADMIN_AUTH);
    removeStoredData(STORAGE_KEYS.ADMIN_TOKEN);
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (!token) return { success: false, error: 'No autenticado.' };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err) {
      return { success: false, error: 'Error de conexión con el servidor.' };
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{
      isAdmin,
      token,
      adminUser,
      isBackendConnected,
      login,
      logout,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
