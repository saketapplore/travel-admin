import api from './api';

/**
 * FAQ Service
 * Handles all FAQ-related API calls
 */
export const faqService = {
  getAll: (page = 1, limit = 10) => api.get(`/faq?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/faq/${id}`),
  create: (data) => api.post('/faq', data),
  update: (id, data) => api.put(`/faq/${id}`, data),
  delete: (id, data) => api.delete(`/faq/${id}`, { data }),
};

export default faqService;

