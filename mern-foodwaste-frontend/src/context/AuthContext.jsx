// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoggedIn: false, user: null, token: null });

  // Load auth data from localStorage on app initialization.
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setAuth({
        isLoggedIn: true,
        token: storedToken,
        user: JSON.parse(storedUser),
      });
    }
  }, []);

  const login = (userData, token) => {
    setAuth({ isLoggedIn: true, user: userData, token });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
