import React, { createContext, useContext, useState } from 'react';
import { authApi } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hrm_user')) || null; }
    catch { return null; }
  });
  const [error, setError] = useState('');

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      const { token, ...userData } = response;
      setUser(userData);
      localStorage.setItem('hrm_user', JSON.stringify(userData));
      localStorage.setItem('hrm_jwt', token);
      setError('');
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrm_user');
    localStorage.removeItem('hrm_jwt');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
