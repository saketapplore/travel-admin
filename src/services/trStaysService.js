import api from './api';

/**
 * TR Stays Service
 * Handles all Stay Management API calls (Beds24 integration)
 */
export const trStaysService = {
  /**
   * List all properties (merged Beds24 + local DB data)
   */
  getProperties: () => api.get('/tr-stays/properties'),

  /**
   * Sync a single property from Beds24 to local DB
   * @param {number} beds24PropertyId - Beds24 property ID
   */
  syncProperty: (beds24PropertyId) =>
    api.post('/tr-stays/sync-property', { beds24PropertyId }),

  /**
   * Bulk sync all properties from Beds24 to local DB
   */
  syncAllProperties: () => api.post('/tr-stays/sync-all-properties'),

  /**
   * Update custom branded images for a property or room
   * @param {Object} params
   * @param {number} params.beds24PropertyId - Beds24 property ID
   * @param {number} [params.beds24RoomId] - Optional Beds24 room ID (for room-level images)
   * @param {string[]} params.images - Array of image URLs
   */
  updateImages: ({ beds24PropertyId, beds24RoomId, images }) =>
    api.post('/tr-stays/update-images', {
      beds24PropertyId,
      ...(beds24RoomId && { beds24RoomId }),
      images
    }),

  /**
   * Upload image files to S3 and get back URLs
   * @param {File[]} files - Array of File objects from file input
   * @returns {Promise<{data: {urls: string[]}}>} Array of uploaded image URLs
   */
  uploadFiles: async (files) => {
    try {
      // The backend /api/upload endpoint only accepts one file at a time via "file" field
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        // Use a relative path from the root /api to avoid /api/admin prefix
        const response = await api.post('../upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 60000 // 60s timeout for file uploads
        });
        
        return response.data?.url;
      });

      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(Boolean);

      return { data: { urls: validUrls } };
    } catch (err) {
      console.error('Batch upload error:', err);
      const backendMessage = err.response?.data?.message;
      throw new Error(backendMessage || err.message || 'Upload failed.');
    }
  },
  
  /**
   * Update property details (Manual Override)
   * @param {string} id - Local DB Property _id
   * @param {Object} data - Fields to update
   */
  patchProperty: (id, data) => api.patch(`/tr-stays/property/${id}`, data),

  /**
   * Update room details (Manual Override)
   * @param {string} id - Local DB Room _id
   * @param {Object} data - Fields to update
   */
  patchRoom: (id, data) => api.patch(`/tr-stays/room/${id}`, data),

  /**
   * Update room pricing/availability calendar on Beds24
   * @param {Object} data - { roomId: number, calendar: [{ from, to, price1, numAvail, minStay }] }
   */
  updateCalendar: (data) => api.post('/tr-stays/update-calendar', data),

  /**
   * Create a new custom property (no Beds24 connection)
   */
  createCustomProperty: (data) => api.post('/tr-stays/property/create-custom', data),

  /**
   * Create a new room for a custom property
   */
  createCustomRoom: (data) => api.post('/tr-stays/room/create-custom', data),

  /**
   * Delete a custom property and all its rooms
   * @param {string} id - MongoDB _id of the property
   */
  deleteCustomProperty: (id) => api.delete(`/tr-stays/property/${id}`),

  /**
   * Location search autocomplete (Google Places via backend proxy)
   * @param {string} input - search query
   */
  placesAutocomplete: (input) =>
    api.get('/tr-stays/places/autocomplete', { params: { input } }),

  /**
   * Resolve a selected place to coordinates + address components
   * @param {string} placeId - Google place_id
   */
  placeDetails: (placeId) =>
    api.get('/tr-stays/places/details', { params: { placeId } }),

  /**
   * Reverse geocode a coordinate to address components (used on pin drag)
   */
  reverseGeocode: (lat, lng) =>
    api.get('/tr-stays/geocode/reverse', { params: { lat, lng } })
};

export default trStaysService;
