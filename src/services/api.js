import axios from 'axios';

// Utility function to decode JWT token (without verification)
const decodeJWT = (token) => {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'https://travel-rumours-api.applore.in/api/admin',
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
          
          // Decode token to check actual role in JWT
          const tokenPayload = decodeJWT(userData.token);
          
          // Log user info in development (without exposing full token)
          if (process.env.NODE_ENV === 'development') {
            console.log('API Request - User Info:', {
              email: userData.email,
              role: userData.role,
              roleKey: userData.roleKey,
              tokenPresent: !!userData.token,
              tokenLength: userData.token?.length || 0,
              tokenRole: tokenPayload?.role || tokenPayload?.roleKey || tokenPayload?.userRole || 'Not found in token',
              tokenEmail: tokenPayload?.email || tokenPayload?.userEmail || 'Not found in token',
              fullTokenPayload: tokenPayload // For debugging
            });
          }
          
          // Warn if there's a mismatch between localStorage role and token role
          if (tokenPayload) {
            const tokenRole = tokenPayload.role || tokenPayload.roleKey || tokenPayload.userRole;
            const localStorageRole = userData.role || userData.roleKey;
            if (tokenRole && localStorageRole && tokenRole.toLowerCase() !== localStorageRole.toLowerCase()) {
              console.warn('Role mismatch detected:', {
                localStorageRole: localStorageRole,
                tokenRole: tokenRole,
                message: 'The role in the token differs from localStorage. The backend will use the token role.'
              });
            }
          }
        } else {
          console.warn('No token found in user data');
        }
      } catch (error) {
        console.error('Error parsing admin user data:', error);
      }
    } else {
      console.warn('No adminUser found in localStorage');
    }

    // Log request details in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        hasAuth: !!config.headers.Authorization,
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
          // For 403 errors, preserve the original error message from backend
          const originalMessage = data?.message || 'Access denied. You do not have permission.';
          return Promise.reject({
            message: originalMessage,
            status,
            data: data, // Include full error data for debugging
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

export const staffAPI = {
  getAll: () => api.get('/staff'),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data),
  update: (id, data) => api.put(`/staff/${id}`, data),
  delete: (id) => api.delete(`/staff/${id}`),
};

export const permissionAPI = {
  getAll: () => api.get('/permission'),
  getById: (id) => api.get(`/permission/${id}`),
  create: (data) => api.post('/permission', data),
  update: (id, data) => api.put(`/permission/${id}`, data),
  delete: (id) => api.delete(`/permission/${id}`),
};

export const roleAPI = {
  getAll: () => api.get('/roles'),
  getActive: () => api.get('/roles/active'),
  getById: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  enable: (id) => api.put(`/roles/${id}/enable`),
  disable: (id) => api.put(`/roles/${id}/disable`),
};

export const faqAPI = {
  getAll: (page = 1, limit = 10) => api.get(`/faq?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/faq/${id}`),
  create: (data) => api.post('/faq', data),
  update: (id, data) => api.put(`/faq/${id}`, data),
  delete: (id, data) => api.delete(`/faq/${id}`, { data }),
};

export const userAPI = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    const queryString = queryParams.toString();
    return api.get(`/users${queryString ? `?${queryString}` : ''}`);
  },
  create: (data) => api.post('/users', data),
  update: (data) => api.put('/users/profile', data),
  activate: (id) => api.put(`/users/activate/${id}`),
  deactivate: (id) => api.put(`/users/deactivate/${id}`),
  manage: (id, data) => api.put(`/users/manage/${id}`, data),
};

export const transactionAPI = {
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
};

export default api;

