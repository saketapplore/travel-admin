import api from './api';

/**
 * Transaction Service
 * Handles all transaction-related API calls
 */
export const transactionService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.bookingType) queryParams.append('bookingType', params.bookingType);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    const queryString = queryParams.toString();
    return api.get(`/transactions${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`/transactions/${id}`),
};

export default transactionService;

