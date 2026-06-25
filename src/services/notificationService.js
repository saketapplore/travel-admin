import api from './api';

/**
 * Admin Notification Service
 * Talks to /api/admin/notifications for the two top-bar bells
 * (stays = "Stay By TR", travel = "Hotel & Flight").
 */
export const notificationService = {
  // Fetch both bells (or a single `source`) with items + unread counts.
  getAll: (source) => api.get('/notifications', { params: source ? { source } : {} }),

  // Mark a bell's notifications read (all, or a subset of ids).
  markRead: (source, ids) => api.post('/notifications/mark-read', { source, ids })
};

export default notificationService;
