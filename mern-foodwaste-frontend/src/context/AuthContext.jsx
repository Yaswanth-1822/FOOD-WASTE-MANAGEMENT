import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    user: null,
    token: null
  });

  // On app start, load token & user from localStorage, then re‑fetch user profile
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      setAuth({ isLoggedIn: true, user: storedUser, token: storedToken });

      // Refresh user profile (to get latest location, etc.)
      axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then(res => {
        setAuth(a => ({
          ...a,
          user: res.data
        }));
        localStorage.setItem('user', JSON.stringify(res.data));
      })
      .catch(() => {
        // token might be invalid
        setAuth({ isLoggedIn: false, user: null, token: null });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
