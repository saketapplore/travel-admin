# API Service Documentation

This folder contains the API service layer for the Travel Rumors Admin Panel.

## Structure

```
src/services/
├── api.js          # Main API configuration and service methods
└── README.md       # This file
```

## API Configuration

### Base URL
```
https://travel-rumours-api.applore.in/api/admin
```

### Axios Instance
The `api.js` file creates a configured axios instance with:
- Base URL set to the admin API endpoint
- 10-second timeout
- JSON content-type headers
- Request/Response interceptors

## Interceptors

### Request Interceptor
Automatically:
- Adds Authorization Bearer token from localStorage
- Logs request details in development mode
- Handles errors gracefully

### Response Interceptor
Automatically:
- Logs response details in development mode
- Handles common HTTP error codes:
  - **401 Unauthorized**: Clears session and redirects to login
  - **403 Forbidden**: Access denied message
  - **404 Not Found**: Resource not found message
  - **500 Server Error**: Server error message
- Handles network errors
- Provides user-friendly error messages

## Available API Services

### 1. Authentication API (`authAPI`)
```javascript
import { authAPI } from './services/api';

// Login
authAPI.login({ email, password });

// Logout
authAPI.logout();

// Get current user
authAPI.getCurrentUser();
```

### 2. Property API (`propertyAPI`)
```javascript
import { propertyAPI } from './services/api';

// Get all properties
propertyAPI.getAll();

// Get property by ID
propertyAPI.getById(id);

// Create property
propertyAPI.create(data);

// Update property
propertyAPI.update(id, data);

// Delete property
propertyAPI.delete(id);
```

### 3. Account API (`accountAPI`)
```javascript
import { accountAPI } from './services/api';

// Get all accounts
accountAPI.getAll();

// Get account by ID
accountAPI.getById(id);

// Create account
accountAPI.create(data);

// Update account
accountAPI.update(id, data);

// Delete account
accountAPI.delete(id);
```

### 4. Booking API (`bookingAPI`)
```javascript
import { bookingAPI } from './services/api';

// Get all bookings
bookingAPI.getAll();

// Get booking by ID
bookingAPI.getById(id);

// Create booking
bookingAPI.create(data);

// Update booking
bookingAPI.update(id, data);

// Delete booking
bookingAPI.delete(id);
```

### 5. Staff API (`staffAPI`)
```javascript
import { staffAPI } from './services/api';

// Get all staff
staffAPI.getAll();

// Get staff by ID
staffAPI.getById(id);

// Create staff
staffAPI.create(data);

// Update staff
staffAPI.update(id, data);

// Delete staff
staffAPI.delete(id);
```

## Usage Example

```javascript
import { authAPI, propertyAPI } from './services/api';

// Login example
const handleLogin = async () => {
  try {
    const response = await authAPI.login({
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('Login successful:', response.data);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};

// Fetch properties example
const fetchProperties = async () => {
  try {
    const response = await propertyAPI.getAll();
    console.log('Properties:', response.data);
  } catch (error) {
    console.error('Failed to fetch properties:', error.message);
  }
};
```

## Error Handling

All API calls return promises that can be caught with try-catch:

```javascript
try {
  const response = await propertyAPI.create(propertyData);
  // Handle success
} catch (error) {
  // error.message contains user-friendly message
  // error.status contains HTTP status code (if available)
  console.error(error.message);
}
```

## Token Management

The API automatically:
1. Retrieves the token from localStorage (`adminUser` object)
2. Adds it to all requests as `Authorization: Bearer <token>`
3. Clears token and redirects to login on 401 errors

## Development vs Production

- **Development**: Full request/response logging to console
- **Production**: Minimal logging, only errors

## Adding New Endpoints

To add a new API endpoint:

```javascript
export const newAPI = {
  getAll: () => api.get('/new-endpoint'),
  getById: (id) => api.get(`/new-endpoint/${id}`),
  create: (data) => api.post('/new-endpoint', data),
  update: (id, data) => api.put(`/new-endpoint/${id}`, data),
  delete: (id) => api.delete(`/new-endpoint/${id}`),
};
```

## Notes

- All API methods return axios response objects
- Access response data via `response.data`
- Token is automatically included in all requests
- Network errors are handled gracefully with fallback messages


