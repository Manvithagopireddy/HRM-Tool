import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const DEMO_USERS = [
  { email: 'admin@nexushr.com', password: 'admin123', name: 'Admin User', role: 'HR Manager', avatar: 'AD', avatarColor: 'var(--grad-primary)' },
  { email: 'hr@nexushr.com',    password: 'hr12345',  name: 'HR Staff',   role: 'HR Specialist', avatar: 'HS', avatarColor: '#10b981' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('hrm_user')) || null; }
    catch { return null; }
  });
  const [error, setError] = useState('');

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safe } = found;
      setUser(safe);
      localStorage.setItem('hrm_user', JSON.stringify(safe));
      setError('');
      return true;
    }
    setError('Invalid email or password.');
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrm_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
