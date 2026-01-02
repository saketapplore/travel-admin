import api from './api';

/**
 * Booking Service
 * Handles all booking-related API calls
 */
export const bookingService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
    if (params.bookingType) queryParams.append('bookingType', params.bookingType);
    const queryString = queryParams.toString();
    return api.get(`/bookings${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export default bookingService;

