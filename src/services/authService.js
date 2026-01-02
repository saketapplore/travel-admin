import api from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export const authService = {
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getCurrentUser: () => api.get('/me'),
};

export default authService;

