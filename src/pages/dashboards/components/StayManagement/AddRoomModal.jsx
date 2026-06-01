import React, { useState } from 'react';
import { X, BedDouble, Loader2, Plus } from 'lucide-react';
import ImageUploader from './ImageUploader';

const EMPTY_FORM = {
  name: '',
  roomType: '',
  qty: 1,
  maxPeople: 2,
  rackRate: '',
  minStay: 1,
  maxStay: '',
  roomDescription: '',
  roomSize: '',
  cleaningFee: '',
  securityDeposit: '',
  maxAdult: '',
  maxChildren: '',
};

const AddRoomModal = ({ isOpen, onClose, property, onAddRoom }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [amenityInput, setAmenityInput] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const addAmenity = () => {
    const trimmed = amenityInput.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      setAmenities(prev => [...prev, trimmed]);
    }
    setAmenityInput('');
  };

  const removeAmenity = (a) => setAmenities(prev => prev.filter(x => x !== a));

  const handleSubmit = async () => {
    if (!formData.name.trim()) { setError('Room name is required'); return; }
    if (!formData.roomDescription.trim()) { setError('Room description is required'); return; }
    if (!formData.minStay || parseInt(formData.minStay) < 1) { setError('Minimum stay must be at least 1'); return; }

    setLoading(true);
    setError('');
    try {
      await onAddRoom({
        ...formData,
        qty: parseInt(formData.qty) || 1,
        maxPeople: parseInt(formData.maxPeople) || 1,
        rackRate: parseFloat(formData.rackRate) || 0,
        minStay: parseInt(formData.minStay) || 1,
        maxStay: formData.maxStay ? parseInt(formData.maxStay) : null,
        roomSize: formData.roomSize ? parseFloat(formData.roomSize) : null,
        cleaningFee: formData.cleaningFee ? parseFloat(formData.cleaningFee) : null,
        securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : null,
        maxAdult: formData.maxAdult ? parseInt(formData.maxAdult) : null,
        maxChildren: formData.maxChildren ? parseInt(formData.maxChildren) : null,
        amenities,
        images,
      });
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(EMPTY_FORM);
    setImages([]);
    setAmenities([]);
    setAmenityInput('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-xl">
              <BedDouble className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Add Room Type</h2>
              <p className="text-xs text-gray-400 truncate max-w-[200px]">{property?.name}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}

          <Field label="Room Name *">
            <input className={INPUT} value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. Deluxe Double Room" />
          </Field>

          <Field label="Room Type">
            <input className={INPUT} value={formData.roomType} onChange={e => handleChange('roomType', e.target.value)} placeholder="e.g. Deluxe, Suite, Standard" />
          </Field>

          <Field label="Description *">
            <textarea
              className={INPUT + ' resize-none'}
              rows={3}
              value={formData.roomDescription}
              onChange={e => handleChange('roomDescription', e.target.value)}
              placeholder="Describe this room type..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Quantity">
              <input className={INPUT} type="number" min="1" value={formData.qty} onChange={e => handleChange('qty', e.target.value)} />
            </Field>
            <Field label="Max People">
              <input className={INPUT} type="number" min="1" value={formData.maxPeople} onChange={e => handleChange('maxPeople', e.target.value)} />
            </Field>
            <Field label="Rack Rate / night">
              <input className={INPUT} type="number" min="0" step="0.01" value={formData.rackRate} onChange={e => handleChange('rackRate', e.target.value)} placeholder="0" />
            </Field>
            <Field label="Room Size (sq ft)">
              <input className={INPUT} type="number" min="0" value={formData.roomSize} onChange={e => handleChange('roomSize', e.target.value)} placeholder="Optional" />
            </Field>
            <Field label="Min Stay (nights) *">
              <input className={INPUT} type="number" min="1" value={formData.minStay} onChange={e => handleChange('minStay', e.target.value)} />
            </Field>
            <Field label="Max Stay (nights)">
              <input className={INPUT} type="number" min="1" value={formData.maxStay} onChange={e => handleChange('maxStay', e.target.value)} placeholder="Optional" />
            </Field>
            <Field label="Max Adults">
              <input className={INPUT} type="number" min="0" value={formData.maxAdult} onChange={e => handleChange('maxAdult', e.target.value)} placeholder="Optional" />
            </Field>
            <Field label="Max Children">
              <input className={INPUT} type="number" min="0" value={formData.maxChildren} onChange={e => handleChange('maxChildren', e.target.value)} placeholder="Optional" />
            </Field>
            <Field label="Cleaning Fee">
              <input className={INPUT} type="number" min="0" step="0.01" value={formData.cleaningFee} onChange={e => handleChange('cleaningFee', e.target.value)} placeholder="Optional" />
            </Field>
            <Field label="Security Deposit">
              <input className={INPUT} type="number" min="0" step="0.01" value={formData.securityDeposit} onChange={e => handleChange('securityDeposit', e.target.value)} placeholder="Optional" />
            </Field>
          </div>

          {/* Amenities */}
          <Field label="Amenities">
            <div className="flex gap-2 mb-2">
              <input
                className={INPUT}
                value={amenityInput}
                onChange={e => setAmenityInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAmenity(); } }}
                placeholder="e.g. Wi-Fi, Air Conditioning (press Enter)"
              />
              <button
                onClick={addAmenity}
                className="flex-shrink-0 p-2.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl border border-orange-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <span key={a} className="inline-flex items-center gap-1.5 text-xs text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1.5 rounded-lg font-medium">
                    {a}
                    <button onClick={() => removeAmenity(a)} className="text-orange-400 hover:text-orange-700 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          {/* Images */}
          <Field label="Room Images">
            <div className="p-4 bg-gray-50/80 border border-gray-100 rounded-2xl">
              <p className="text-xs text-gray-500 mb-3">
                Upload or paste image URLs. They'll be saved automatically when you add the room.
              </p>
              <ImageUploader
                images={images}
                onChange={(imgs) => setImages(imgs)}
                saving={false}
                label="Room Photos"
              />
            </div>
          </Field>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BedDouble className="w-4 h-4" />}
            {loading ? 'Adding...' : 'Add Room'}
          </button>
        </div>
      </div>
    </div>
  );
};

const INPUT = 'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 outline-none transition-all bg-white';

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
    {children}
  </div>
);

export default AddRoomModal;
