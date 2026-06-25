import api from './api';

export const platformFeeService = {
  // Get all platform fees
  getPlatformFees: async () => {
    try {
      const response = await api.get('/platform-fee');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update platform fee (global default, per-country, or per-city)
  updatePlatformFee: async (module, amount, feeType = 'percentage', city = null, country = null) => {
    try {
      const response = await api.post('/platform-fee/update', {
        module,
        amount,
        feeType,
        city,
        country
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove a country/city override (the global default cannot be deleted)
  deletePlatformFee: async (id) => {
    try {
      const response = await api.delete(`/platform-fee/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search cities for location-specific fees
  searchCities: async (query) => {
    try {
      const response = await api.get(`/cities/search?query=${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

