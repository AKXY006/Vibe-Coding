// src/services/api.js
// Centralized API configuration ready for Spring Boot REST API integration

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Standard HTTP helper ready to swap to real fetch() when Spring Boot is connected.
 * In development without backend, services use simulated promise responses.
 */
export const request = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`[API] Fallback to mock data for ${endpoint}:`, error.message);
    throw error;
  }
};
