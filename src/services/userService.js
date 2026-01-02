import api from './api';

/**
 * User Service
 * Handles all user-related API calls
 */
export const userService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    const queryString = queryParams.toString();
    return api.get(`/users${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (data) => api.put('/users/profile', data),
  activate: (id) => api.put(`/users/activate/${id}`),
  deactivate: (id) => api.put(`/users/deactivate/${id}`),
  manage: (id, data) => api.put(`/users/manage/${id}`, data),
};

export default userService;

