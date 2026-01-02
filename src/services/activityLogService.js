import api from './api';

/**
 * Activity Log Service
 * Handles all activity log-related API calls
 */
export const activityLogService = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.action) queryParams.append('action', params.action);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    const queryString = queryParams.toString();
    return api.get(`/activity-logs${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => api.get(`/activity-logs/${id}`),
};

export default activityLogService;

