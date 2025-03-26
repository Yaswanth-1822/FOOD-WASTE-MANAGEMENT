// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initially, user is not logged in
  const [auth, setAuth] = useState({ isLoggedIn: false, user: null });

  const login = (userData) => {
    setAuth({ isLoggedIn: true, user: userData });
    // Optionally, save token/info to localStorage here
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null });
    // Optionally, remove token from localStorage here
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
