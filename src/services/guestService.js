import api from './api';

/**
 * Guest Management Service (Point 12)
 * Block / unblock guest contacts (phone + email) so blocked guests can't book.
 */
export const guestService = {
  getBlocked: (params = {}) => {
    const qp = new URLSearchParams();
    if (params.page) qp.append('page', params.page);
    if (params.limit) qp.append('limit', params.limit);
    if (params.search) qp.append('search', params.search);
    const qs = qp.toString();
    return api.get(`/guests/blocked${qs ? `?${qs}` : ''}`);
  },
  block: (data) => api.post('/guests/block', data),
  unblock: (id) => api.post(`/guests/unblock/${id}`)
};

export default guestService;
