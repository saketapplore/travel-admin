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
  baseURL: 'http://localhost:8080/api/admin',
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

// Export only the axios instance for use in service files
export default api;

