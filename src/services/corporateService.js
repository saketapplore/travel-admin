import api from './api';

const qs = (params = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.append(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
};

/**
 * Corporate (GST) reporting service (Points 13–16).
 */
export const corporateService = {
  getBookings: (params = {}) => api.get(`/corporate/bookings${qs(params)}`),
  getSummary: (params = {}) => api.get(`/corporate/summary${qs(params)}`),
  getRanking: (params = {}) => api.get(`/corporate/ranking${qs(params)}`)
};

export default corporateService;
