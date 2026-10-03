// src/services/api.js
// Centralized API configuration connected to Spring Boot REST API (http://localhost:8080/api)

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const TOKEN_STORAGE_KEY = 'savoria_auth_token';

/**
 * Standard HTTP helper with automatic JWT Authorization header injection and error handling.
 */
export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage = (data && data.message) || `HTTP error! Status: ${response.status}`;
      const err = new Error(errorMessage);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    // Spring Boot returns ApiResponse: { success, message, data }
    if (data && typeof data === 'object' && 'data' in data && 'success' in data) {
      return data.data;
    }

    return data;
  } catch (error) {
    console.warn(`[API] Request failed for ${endpoint}:`, error.message);
    throw error;
  }
};
