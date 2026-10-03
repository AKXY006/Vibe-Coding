// src/context/AuthContext.jsx
// JWT-backed user authentication context connected with Spring Boot (/api/auth)

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { request, TOKEN_STORAGE_KEY } from '../services/api';

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

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync token changes to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  // Sync user changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  /**
   * Login with email and password via Spring Boot POST /api/auth/login
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const authData = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const loggedInUser = {
        id: authData.id,
        name: authData.name || email.split('@')[0],
        email: authData.email,
        role: authData.role,
        phone: authData.phone || '',
        address: authData.address || '',
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
        joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };

      setToken(authData.token);
      setUser(loggedInUser);
      showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
      return { success: true, user: loggedInUser };
    } catch (err) {
      console.warn('[AuthContext] Backend login failed, attempting local fallback:', err.message);

      // Graceful offline fallback
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const username = email.split('@')[0];
        const formattedName = username.charAt(0).toUpperCase() + username.slice(1);
        const fallbackUser = {
          id: 1,
          name: formattedName,
          email,
          role: 'ROLE_USER',
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
          joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        };
        setUser(fallbackUser);
        showToast(`Offline mode: Welcome, ${fallbackUser.name}!`, 'info');
        return { success: true, user: fallbackUser };
      }

      showToast(err.message || 'Invalid email or password.', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user via Spring Boot POST /api/auth/register
   */
  const register = async (name, email, password, phone = '', address = '') => {
    setLoading(true);
    try {
      const authData = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          phone,
          address,
        }),
      });

      const newUser = {
        id: authData.id,
        name: authData.name || name.trim(),
        email: authData.email || email.trim(),
        role: authData.role || 'ROLE_USER',
        phone: authData.phone || phone,
        address: authData.address || address,
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
        joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };

      setToken(authData.token);
      setUser(newUser);
      showToast(`Account created successfully! Welcome, ${newUser.name}.`, 'success');
      return { success: true, user: newUser };
    } catch (err) {
      console.warn('[AuthContext] Backend register failed, attempting local fallback:', err.message);

      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        const fallbackUser = {
          id: Date.now(),
          name: name.trim(),
          email: email.trim(),
          role: 'ROLE_USER',
          avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
          joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        };
        setUser(fallbackUser);
        showToast(`Offline mode: Account created for ${fallbackUser.name}.`, 'info');
        return { success: true, user: fallbackUser };
      }

      showToast(err.message || 'Registration failed. Email may already exist.', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user and clear tokens
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    showToast('You have been logged out successfully.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
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
