import { useState, useCallback, useEffect } from 'react';
import { trStaysService } from '../../../../services/trStaysService';

/**
 * Custom hook for Stay Management module
 * Handles property listing, syncing, and image management
 */
export const useStayManagement = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [syncingPropertyId, setSyncingPropertyId] = useState(null);
  const [bulkSyncing, setBulkSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all | synced | unsynced
  const [updatingImages, setUpdatingImages] = useState(false);
  const [imageUpdateTarget, setImageUpdateTarget] = useState(null); // { propertyId, roomId? }

  // Fetch all properties
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await trStaysService.getProperties();
      const data = response.data?.data || response.data || [];
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch TR Stays properties:', err);
      setError(err.message || 'Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Sync a single property
  const syncProperty = useCallback(async (beds24PropertyId) => {
    setSyncingPropertyId(beds24PropertyId);
    setSyncResult(null);
    try {
      const response = await trStaysService.syncProperty(beds24PropertyId);
      setSyncResult({
        type: 'success',
        message: response.data?.message || `Property ${beds24PropertyId} synced successfully`
      });
      // Refresh data to reflect sync status
      await fetchProperties();
    } catch (err) {
      console.error('Sync property error:', err);
      setSyncResult({
        type: 'error',
        message: err.message || `Failed to sync property ${beds24PropertyId}`
      });
    } finally {
      setSyncingPropertyId(null);
    }
  }, [fetchProperties]);

  // Bulk sync all properties
  const syncAllProperties = useCallback(async () => {
    setBulkSyncing(true);
    setSyncResult(null);
    try {
      const response = await trStaysService.syncAllProperties();
      const results = response.data?.results || {};
      setSyncResult({
        type: 'success',
        message: response.data?.message || `Bulk sync completed. ${results.success || 0} succeeded, ${results.failed || 0} failed.`
      });
      await fetchProperties();
    } catch (err) {
      console.error('Bulk sync error:', err);
      setSyncResult({
        type: 'error',
        message: err.message || 'Bulk sync failed'
      });
    } finally {
      setBulkSyncing(false);
    }
  }, [fetchProperties]);

  // Update images for property or room
  // Custom properties (MongoDB ObjectId) use patchProperty/patchRoom; Beds24 use updateImages endpoint
  const updateImages = useCallback(async (propertyId, images, roomId = null) => {
    setUpdatingImages(true);
    setImageUpdateTarget({ propertyId, roomId });
    try {
      // Custom properties have a 24-char hex MongoDB ObjectId as their id
      const isCustomProperty = /^[0-9a-f]{24}$/i.test(String(propertyId));

      if (isCustomProperty) {
        if (roomId) {
          await trStaysService.patchRoom(roomId, { images });
        } else {
          await trStaysService.patchProperty(propertyId, { images });
        }
      } else {
        await trStaysService.updateImages({ beds24PropertyId: propertyId, beds24RoomId: roomId, images });
      }

      setSyncResult({
        type: 'success',
        message: roomId ? 'Room images updated successfully' : 'Property images updated successfully'
      });
      await fetchProperties();

      setSelectedProperty((prev) => {
        if (!prev || prev.id !== propertyId) return prev;
        if (roomId) {
          return {
            ...prev,
            roomTypes: (prev.roomTypes || []).map((room) =>
              room.id === roomId ? { ...room, images } : room
            )
          };
        }
        return { ...prev, images };
      });
    } catch (err) {
      console.error('Image update error:', err);
      setSyncResult({ type: 'error', message: err.message || 'Failed to update images' });
      throw err;
    } finally {
      setUpdatingImages(false);
      setImageUpdateTarget(null);
    }
  }, [fetchProperties]);

  // Open detail panel for a property
  const openDetail = useCallback((property) => {
    setSelectedProperty(property);
    setDetailOpen(true);
    setSyncResult(null);
  }, []);

  // Close detail panel
  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    // Delay clearing selected property for exit animation
    setTimeout(() => setSelectedProperty(null), 300);
  }, []);

  // Clear sync result notification
  const clearSyncResult = useCallback(() => {
    setSyncResult(null);
  }, []);

  // Filtered properties
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.address || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'custom' && p.isCustomProperty) ||
      (filterStatus === 'synced' && p.isSynced && !p.isCustomProperty) ||
      (filterStatus === 'unsynced' && !p.isSynced && !p.isCustomProperty);

    return matchesSearch && matchesFilter;
  });

  return {
    properties: filteredProperties,
    totalCount: properties.length,
    loading,
    error,
    selectedProperty,
    detailOpen,
    syncingPropertyId,
    bulkSyncing,
    syncResult,
    searchQuery,
    filterStatus,
    updatingImages,
    imageUpdateTarget,
    setSearchQuery,
    setFilterStatus,
    fetchProperties,
    syncProperty,
    syncAllProperties,
    updateImages,
    openDetail,
    closeDetail,
    clearSyncResult,
    
    /**
     * Patch property with manual overrides
     */
    updatePropertyDetail: async (id, data) => {
      try {
        const response = await trStaysService.patchProperty(id, data);
        setSyncResult({ type: 'success', message: 'Property updated successfully' });
        
        // Update selectedProperty instantly
        setSelectedProperty(prev => {
          if (!prev || prev._id !== id) return prev;
          return { ...prev, ...data };
        });

        await fetchProperties();
        return response.data;
      } catch (err) {
        console.error('Update property error:', err);
        setSyncResult({ type: 'error', message: err.response?.data?.message || 'Failed to update property' });
        throw err;
      }
    },

    /**
     * Patch room with manual overrides
     */
    updateRoomDetail: async (id, data) => {
      try {
        const response = await trStaysService.patchRoom(id, data);
        setSyncResult({ type: 'success', message: 'Room updated successfully' });
        
        // Update selectedProperty instantly
        setSelectedProperty(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            roomTypes: (prev.roomTypes || []).map(room => 
              room._id === id ? { ...room, ...data } : room
            )
          };
        });

        await fetchProperties();
        return response.data;
      } catch (err) {
        console.error('Update room error:', err);
        setSyncResult({ type: 'error', message: err.response?.data?.message || 'Failed to update room' });
        throw err;
      }
    },

    /**
     * Update room calendar (pricing/availability) on Beds24 or local (custom rooms)
     */
    updateRoomCalendar: async (roomId, calendarData) => {
      try {
        const response = await trStaysService.updateCalendar({ roomId, calendar: calendarData });
        const calendarHistory = response.data?.calendarHistory;
        setSyncResult({ type: 'success', message: 'Calendar updated successfully' });

        setSelectedProperty(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            roomTypes: (prev.roomTypes || []).map(room =>
              room.id === roomId ? { ...room, calendarHistory } : room
            )
          };
        });

        await fetchProperties();
        return calendarHistory;
      } catch (err) {
        console.error('Update calendar error:', err);
        setSyncResult({ type: 'error', message: err.response?.data?.message || 'Failed to update calendar' });
        throw err;
      }
    },

    /**
     * Create a new custom property (no Beds24)
     */
    createCustomProperty: async (data) => {
      try {
        const response = await trStaysService.createCustomProperty(data);
        setSyncResult({ type: 'success', message: 'Custom property created successfully!' });
        await fetchProperties();
        return response.data;
      } catch (err) {
        console.error('Create custom property error:', err);
        setSyncResult({ type: 'error', message: err.response?.data?.message || 'Failed to create property' });
        throw err;
      }
    },

    /**
     * Add a room to a custom property
     */
    createCustomRoom: async (propertyMongoId, roomData) => {
      try {
        const response = await trStaysService.createCustomRoom({ ...roomData, propertyId: propertyMongoId });
        const newRoom = response.data?.data;
        setSyncResult({ type: 'success', message: 'Room added successfully!' });

        if (newRoom) {
          setSelectedProperty(prev => {
            if (!prev || String(prev._id) !== String(propertyMongoId)) return prev;
            const roomWithId = { ...newRoom, id: String(newRoom._id || newRoom.id), isCustomRoom: true };
            return { ...prev, roomTypes: [...(prev.roomTypes || []), roomWithId] };
          });
        }

        await fetchProperties();
        return response.data;
      } catch (err) {
        console.error('Create custom room error:', err);
        setSyncResult({ type: 'error', message: err.response?.data?.message || 'Failed to add room' });
        throw err;
      }
    },

    /**
     * Delete a custom property and all its rooms
     */
    deleteCustomProperty: async (propertyId) => {
      try {
        await trStaysService.deleteCustomProperty(propertyId);
        setSyncResult({ type: 'success', message: 'Property deleted successfully' });
        setDetailOpen(false);
        setTimeout(() => setSelectedProperty(null), 300);
        await fetchProperties();
      } catch (err) {
        console.error('Delete custom property error:', err);
        setSyncResult({ type: 'error', message: err.response?.data?.message || 'Failed to delete property' });
        throw err;
      }
    }
  };
};
