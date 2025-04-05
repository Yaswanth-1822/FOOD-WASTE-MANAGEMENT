// src/context/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initially, user is not logged in.
  const [auth, setAuth] = useState({ isLoggedIn: false, user: null });

  const login = (userData) => {
    setAuth({ isLoggedIn: true, user: userData });
    // Optionally, store token in localStorage.
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null });
    // Optionally, remove token from localStorage.
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
