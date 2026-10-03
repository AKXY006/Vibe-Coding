// src/context/AuthContext.jsx
// Frontend-only user authentication context with localStorage persistence

import React, { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);
const USER_STORAGE_KEY = 'savoria_current_user';

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    // Simulated validation and login
    const username = email.split('@')[0];
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
    
    const loggedInUser = {
      name: formattedName,
      email: email,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setUser(loggedInUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
    showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
    return { success: true };
  };

  const register = (name, email, password) => {
    const newUser = {
      name: name.trim(),
      email: email.trim(),
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    showToast(`Account created successfully! Welcome, ${newUser.name}.`, 'success');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    showToast('You have been logged out successfully.', 'info');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
