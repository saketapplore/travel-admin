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

  // Update platform fee
  updatePlatformFee: async (module, amount, feeType = 'percentage', city = null) => {
    try {
      const response = await api.post('/platform-fee/update', {
        module,
        amount,
        feeType,
        city
      });
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

