import api from './api';

/**
 * Permission Service
 * Handles all permission-related API calls
 */
export const permissionService = {
  getAll: () => api.get('/permission'),
  getById: (id) => api.get(`/permission/${id}`),
  create: (data) => api.post('/permission', data),
  update: (id, data) => api.put(`/permission/${id}`, data),
  delete: (id) => api.delete(`/permission/${id}`),
};

export default permissionService;

