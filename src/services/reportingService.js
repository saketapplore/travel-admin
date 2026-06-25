import api from './api';

/**
 * Reporting & Analytics Service
 * Handles all reporting and analytics-related API calls
 */
export const reportingService = {
  // Consolidated bookings summary (Total/Confirmed/Cancelled/Value) across
  // Stays, Hotels and Flights for a date window (defaults to current month).
  getSummary: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.from) queryParams.append('from', params.from);
    if (params.to) queryParams.append('to', params.to);
    const queryString = queryParams.toString();
    return api.get(`/reports/summary${queryString ? `?${queryString}` : ''}`);
  },
  // Today's (or ?date=) check-ins and check-outs across stays + hotels.
  getMovements: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    const queryString = queryParams.toString();
    return api.get(`/reports/movements${queryString ? `?${queryString}` : ''}`);
  },
  // Live occupancy: occupied properties + in-house guests.
  getOccupancy: () => api.get('/reports/occupancy'),
  // Vacant (and occupied) properties for a selected date.
  getVacantProperties: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    const queryString = queryParams.toString();
    return api.get(`/reports/vacant-properties${queryString ? `?${queryString}` : ''}`);
  },
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
  }
};

export default reportingService;
