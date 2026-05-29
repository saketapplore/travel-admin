import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, BedDouble, RefreshCw } from 'lucide-react';

const EditRoomModal = ({ isOpen, onClose, room, property, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    roomDescription: '',
    qty: 1,
    minPrice: 0,
    rackRate: 0,
    amenities: []
  });
  const [newAmenity, setNewAmenity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (room) {
      // Flatten feature codes if they exist to provide a starting point for amenities
      const flatFeatureCodes = (room.featureCodes || [])
        .flat()
        .filter(code => typeof code === 'string')
        .map(code => code.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));

      setFormData({
        name: room.name || '',
        roomDescription: room.roomDescription || room.texts?.[0]?.roomDescription || '',
        qty: room.qty || 1,
        minPrice: room.minPrice || 0,
        rackRate: room.rackRate || 0,
        amenities: room.amenities?.length > 0 ? room.amenities : flatFeatureCodes
      });
    }
  }, [room]);

  if (!isOpen || !room) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onUpdate(room._id, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update room');
    } finally {
      setLoading(false);
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData({
        ...formData,
        amenities: [...new Set([...formData.amenities, newAmenity.trim()])]
      });
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl">
              <BedDouble className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Edit Room Details</h3>
              <p className="text-xs text-gray-500">{property?.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Warning */}
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
            Note: These changes are <span className="font-bold underline">Manual Overrides</span>. 
            Once saved, these fields will be protected and will NOT be overwritten by the daily Beds24 sync.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Room Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Room Description
              </label>
              <textarea
                rows={4}
                value={formData.roomDescription}
                onChange={e => setFormData({ ...formData, roomDescription: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm resize-none"
                placeholder="Describe this room type..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Quantity
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formData.qty}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, qty: val });
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Min Price ({property?.currency || '₹'})
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formData.minPrice}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setFormData({ ...formData, minPrice: val });
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                  Rack Rate ({property?.currency || '₹'})
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formData.rackRate}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9.]/g, '');
                    setFormData({ ...formData, rackRate: val });
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Amenities Tag Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Room Amenities
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const flatFeatureCodes = (room.featureCodes || [])
                      .flat()
                      .filter(code => typeof code === 'string')
                      .map(code => code.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
                    setFormData({ ...formData, amenities: flatFeatureCodes });
                  }}
                  className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Pull Original from Beds24
                </button>
              </div>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={e => setNewAmenity(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                  placeholder="e.g. Bathtub, Mountain View"
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl transition-all text-sm"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 border border-orange-100 rounded-lg text-xs font-bold"
                  >
                    {amenity}
                    <button 
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="hover:text-orange-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {formData.amenities.length === 0 && (
                  <p className="text-[11px] text-gray-400 italic py-2">No amenities added yet.</p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Save Overrides'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoomModal;
