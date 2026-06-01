import React, { useState } from 'react';
import { X, Building2, MapPin, Clock, Image, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import ImageUploader from './ImageUploader';
import LocationPicker from './LocationPicker';

const STEPS = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Location' },
  { id: 3, title: 'Timings' },
  { id: 4, title: 'Images' },
  { id: 5, title: 'Review' },
];

const PROPERTY_TYPES = ['Hotel', 'Villa', 'Apartment', 'Resort', 'Hostel', 'Guesthouse', 'Cottage', 'Lodge'];
const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'THB'];

const EMPTY_FORM = {
  name: '',
  propertyType: 'Hotel',
  phone: '',
  email: '',
  currency: 'INR',
  address: '',
  city: '',
  state: '',
  country: '',
  postcode: '',
  latitude: '',
  longitude: '',
  checkInStart: '14:00',
  checkInEnd: '00:00',
  checkOutEnd: '11:00',
  allowGuestCancellation: 'no',
};

const CreatePropertyModal = ({ isOpen, onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) { setError('Property name is required'); return false; }
      if (!formData.propertyType) { setError('Property type is required'); return false; }
    }
    if (step === 2) {
      if (!formData.city.trim()) { setError('City is required'); return false; }
      if (!formData.country.trim()) { setError('Country is required'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await onCreate({
        ...formData,
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        images,
      });
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setError('');
    setImages([]);
    setFormData(EMPTY_FORM);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-xl">
              <Building2 className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Create Custom Property</h2>
              <p className="text-xs text-gray-400">Step {step} of 5 — {STEPS[step - 1].title}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-4 flex gap-1.5">
          {STEPS.map(s => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s.id <= step ? 'bg-orange-500' : 'bg-gray-100'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}

          {/* Step 1 — Basic Info */}
          {step === 1 && (
            <>
              <Field label="Property Name *">
                <input className={INPUT} value={formData.name} onChange={e => handleChange('name', e.target.value)} placeholder="e.g. The Grand Retreat" />
              </Field>
              <Field label="Property Type *">
                <select className={INPUT} value={formData.propertyType} onChange={e => handleChange('propertyType', e.target.value)}>
                  {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Phone">
                  <input className={INPUT} value={formData.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" />
                </Field>
                <Field label="Email">
                  <input className={INPUT} type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} placeholder="info@property.com" />
                </Field>
              </div>
              <Field label="Currency">
                <select className={INPUT} value={formData.currency} onChange={e => handleChange('currency', e.target.value)}>
                  {CURRENCIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
            </>
          )}

          {/* Step 2 — Location */}
          {step === 2 && (
            <>
              <LocationPicker
                value={{
                  latitude: formData.latitude,
                  longitude: formData.longitude,
                  address: formData.address,
                  city: formData.city,
                  state: formData.state,
                  country: formData.country,
                  postcode: formData.postcode,
                }}
                onLocationChange={(loc) => {
                  setFormData(prev => ({
                    ...prev,
                    latitude: loc.latitude ?? prev.latitude,
                    longitude: loc.longitude ?? prev.longitude,
                    address: loc.address ?? prev.address,
                    city: loc.city ?? prev.city,
                    state: loc.state ?? prev.state,
                    country: loc.country ?? prev.country,
                    postcode: loc.postcode ?? prev.postcode,
                  }));
                  setError('');
                }}
              />

              <p className="text-[11px] text-gray-400 -mb-1">
                Auto-filled from the map — you can edit any field below.
              </p>

              <Field label="Address">
                <input className={INPUT} value={formData.address} onChange={e => handleChange('address', e.target.value)} placeholder="123 Main Street" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="City *">
                  <input className={INPUT} value={formData.city} onChange={e => handleChange('city', e.target.value)} placeholder="Mumbai" />
                </Field>
                <Field label="State">
                  <input className={INPUT} value={formData.state} onChange={e => handleChange('state', e.target.value)} placeholder="Maharashtra" />
                </Field>
                <Field label="Country *">
                  <input className={INPUT} value={formData.country} onChange={e => handleChange('country', e.target.value)} placeholder="India" />
                </Field>
                <Field label="Postcode">
                  <input className={INPUT} value={formData.postcode} onChange={e => handleChange('postcode', e.target.value)} placeholder="400001" />
                </Field>
                <Field label="Latitude">
                  <input className={INPUT} type="number" step="any" value={formData.latitude} onChange={e => handleChange('latitude', e.target.value)} placeholder="19.0760" />
                </Field>
                <Field label="Longitude">
                  <input className={INPUT} type="number" step="any" value={formData.longitude} onChange={e => handleChange('longitude', e.target.value)} placeholder="72.8777" />
                </Field>
              </div>
            </>
          )}

          {/* Step 3 — Timings */}
          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Check-in From">
                <input className={INPUT} type="time" value={formData.checkInStart} onChange={e => handleChange('checkInStart', e.target.value)} />
              </Field>
              <Field label="Check-in Until">
                <input className={INPUT} type="time" value={formData.checkInEnd} onChange={e => handleChange('checkInEnd', e.target.value)} />
              </Field>
              <Field label="Check-out By">
                <input className={INPUT} type="time" value={formData.checkOutEnd} onChange={e => handleChange('checkOutEnd', e.target.value)} />
              </Field>
              <Field label="Guest Cancellation">
                <select className={INPUT} value={formData.allowGuestCancellation} onChange={e => handleChange('allowGuestCancellation', e.target.value)}>
                  <option value="no">Not Allowed</option>
                  <option value="yes">Allowed</option>
                </select>
              </Field>
            </div>
          )}

          {/* Step 4 — Images */}
          {step === 4 && (
            <div className="p-4 bg-gray-50/80 border border-gray-100 rounded-2xl">
              <p className="text-xs text-gray-500 mb-3">
                Upload or paste image URLs. They'll be saved automatically when you create the property.
              </p>
              <ImageUploader
                images={images}
                onChange={(imgs) => setImages(imgs)}
                saving={false}
                label="Property Photos"
              />
            </div>
          )}

          {/* Step 5 — Review */}
          {step === 5 && (
            <div className="space-y-3">
              <div className="px-4 py-4 bg-orange-50 border border-orange-100 rounded-2xl">
                <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-3">Review Details</p>
                <div className="space-y-0">
                  <ReviewRow label="Name" value={formData.name} />
                  <ReviewRow label="Type" value={formData.propertyType} />
                  <ReviewRow label="Location" value={[formData.city, formData.state, formData.country].filter(Boolean).join(', ')} />
                  <ReviewRow label="Phone" value={formData.phone || '—'} />
                  <ReviewRow label="Email" value={formData.email || '—'} />
                  <ReviewRow label="Currency" value={formData.currency} />
                  <ReviewRow label="Check-in" value={`${formData.checkInStart} – ${formData.checkInEnd}`} />
                  <ReviewRow label="Check-out" value={`By ${formData.checkOutEnd}`} />
                  <ReviewRow label="Cancellation" value={formData.allowGuestCancellation === 'yes' ? 'Allowed' : 'Not Allowed'} />
                  <ReviewRow label="Images" value={`${images.length} photo(s)`} />
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center">You can add room types after the property is created.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={step === 1 ? handleClose : handleBack}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              {loading ? 'Creating...' : 'Create Property'}
            </button>
          )}
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

const ReviewRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-orange-100 last:border-0">
    <span className="text-xs text-orange-600 font-medium">{label}</span>
    <span className="text-xs text-gray-700 font-semibold max-w-[60%] text-right truncate">{value}</span>
  </div>
);

export default CreatePropertyModal;
