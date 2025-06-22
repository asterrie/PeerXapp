import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import fetchJson from '../utils/fetchJson';

const API = process.env.REACT_APP_API_URL;
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return setUser(null);
    fetchJson(`${API}/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(setUser)
      .catch(() => {
        setToken(null);
        localStorage.removeItem('token');
        setUser(null);
      });
  }, [token]);

  const login = useCallback((t) => {
    setToken(t);
    localStorage.setItem('token', t);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
