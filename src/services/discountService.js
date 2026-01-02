import api from './api';

/**
 * Discount & Package Service
 * Handles all discount and package-related API calls
 */
export const discountService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    const queryString = queryParams.toString();
    return api.get(`/discounts${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`/discounts/${id}`),
  create: (data) => api.post('/discounts', data),
  update: (id, data) => api.put(`/discounts/${id}`, data),
  delete: (id) => api.delete(`/discounts/${id}`),
};

export default discountService;

