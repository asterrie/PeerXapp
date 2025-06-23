import React, { createContext, useContext, useState, useEffect } from 'react';

// Tworzymy kontekst
const AuthContext = createContext();

// Hook do wygodnego korzystania z kontekstu
export const useAuth = () => useContext(AuthContext);

// Provider - opakowuje całą aplikację i dostarcza dane auth
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // np. obiekt user z backendu

  // Przy starcie sprawdzamy czy token jest w localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) {
      setToken(savedToken);
      setUser(savedUser ? JSON.parse(savedUser) : null);
    }
  }, []);

  // Funkcja do logowania - zapisujemy token i usera
  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Funkcja do wylogowania
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Czy jesteśmy zalogowani?
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
