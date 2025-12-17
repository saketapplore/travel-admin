import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://0j600dqx-8080.inc1.devtunnels.ms/api/admin',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      try {
        const userData = JSON.parse(adminUser);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (error) {
        console.error('Error parsing admin user data:', error);
      }
    }

    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Handle common error responses
    if (error.response) {
      const { status, data } = error.response;

      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error Response:', {
          status,
          url: error.config?.url,
          data,
        });
      }

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - only logout for critical endpoints (login, logout)
          // For other endpoints, let the component handle the error
          const url = error.config?.url || '';
          const isCriticalEndpoint = url.includes('/login') || url.includes('/logout') || url.includes('/auth');
          
          if (isCriticalEndpoint) {
            localStorage.removeItem('adminUser');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
          
          return Promise.reject({
            message: 'Session expired. Please login again.',
            status,
          });

        case 403:
          return Promise.reject({
            message: 'Access denied. You do not have permission.',
            status,
          });

        case 404:
          return Promise.reject({
            message: 'Resource not found.',
            status,
          });

        case 500:
          return Promise.reject({
            message: 'Server error. Please try again later.',
            status,
          });

        default:
          return Promise.reject({
            message: data?.message || 'An error occurred. Please try again.',
            status,
          });
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Unable to connect to server. Please check your internet connection.',
        status: null,
      });
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject({
        message: 'An unexpected error occurred.',
        status: null,
      });
    }
  }
);

// API service methods
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getCurrentUser: () => api.get('/me'),
};

export const propertyAPI = {
  getAll: () => api.get('/properties'),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
};

export const accountAPI = {
  getAll: () => api.get('/accounts'),
  getById: (id) => api.get(`/accounts/${id}`),
  create: (data) => api.post('/accounts', data),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
};

export const bookingAPI = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export const staffAPI = {
  getAll: () => api.get('/staff'),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
};

export default api;

