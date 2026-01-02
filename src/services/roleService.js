import api from './api';

/**
 * Role Service
 * Handles all role-related API calls
 */
export const roleService = {
  getAll: () => api.get('/roles'),
  getActive: () => api.get('/roles/active'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  enable: (id) => api.put(`/roles/${id}/enable`),
  disable: (id) => api.put(`/roles/${id}/disable`),
};

export default roleService;

