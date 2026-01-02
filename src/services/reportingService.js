import api from './api';

/**
 * Reporting & Analytics Service
 * Handles all reporting and analytics-related API calls
 */
export const reportingService = {
  getDashboardStats: () => api.get('/reports/dashboard'),
  getBookingStats: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    const queryString = queryParams.toString();
    return api.get(`/reports/bookings${queryString ? `?${queryString}` : ''}`);
  },
  getRevenueStats: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    const queryString = queryParams.toString();
    return api.get(`/reports/revenue${queryString ? `?${queryString}` : ''}`);
  },
  getBookingReport: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.format) queryParams.append('format', params.format);
    const queryString = queryParams.toString();
    return api.get(`/reports/bookings/export${queryString ? `?${queryString}` : ''}`);
  },
};

export default reportingService;

