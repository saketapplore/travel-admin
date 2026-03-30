import React from 'react';
import FileUpload from './FileUpload';
import AvailabilityCalendar from './AvailabilityCalendar';

const PropertyModal = ({
  show,
  editingProperty,
  formData,
  setFormData,
  uploadedFiles,
  selectedDates,
  calendarMonth,
  calendarYear,
  errors,
  setErrors,
  propertyManagers,
  onClose,
  onSubmit,
  onFileUpload,
  onRemoveFile,
  onCalendarNavigate,
  onToggleDate
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-6 flex-shrink-0">
          {editingProperty ? 'Edit Property' : 'Add New Property'}
        </h3>
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                data-error={errors.name ? 'true' : 'false'}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value });
                  if (errors.location) setErrors({ ...errors, location: '' });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                data-error={errors.location ? 'true' : 'false'}
              />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rooms <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.rooms}
                onChange={(e) => {
                  setFormData({ ...formData, rooms: e.target.value });
                  if (errors.rooms) setErrors({ ...errors, rooms: '' });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.rooms ? 'border-red-500' : 'border-gray-300'
                }`}
                data-error={errors.rooms ? 'true' : 'false'}
              />
              {errors.rooms && <p className="text-red-500 text-xs mt-1">{errors.rooms}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (per night) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => {
                  setFormData({ ...formData, price: e.target.value });
                  if (errors.price) setErrors({ ...errors, price: '' });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="$200/night"
                data-error={errors.price ? 'true' : 'false'}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option>Available</option>
                <option>Booked</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Property Manager <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    assignedTo: e.target.value,
                    assignedToName:
                      propertyManagers.find((pm) => pm.email === e.target.value)?.name || ''
                  });
                  if (errors.assignedTo) setErrors({ ...errors, assignedTo: '' });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.assignedTo ? 'border-red-500' : 'border-gray-300'
                }`}
                data-error={errors.assignedTo ? 'true' : 'false'}
              >
                <option value="">Select Manager</option>
                {propertyManagers.map((manager) => (
                  <option key={manager.id} value={manager.email}>
                    {manager.name} ({manager.email})
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="text-red-500 text-xs mt-1">{errors.assignedTo}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (errors.description) setErrors({ ...errors, description: '' });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows="3"
                placeholder="Enter property description (optional)"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <input
                type="text"
                value={formData.amenities}
                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Pool, WiFi, Kitchen"
              />
            </div>

            <FileUpload
              uploadedFiles={uploadedFiles}
              onUpload={onFileUpload}
              onRemove={onRemoveFile}
              errors={errors}
            />

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability Calendar
              </label>
              <AvailabilityCalendar
                calendarMonth={calendarMonth}
                calendarYear={calendarYear}
                selectedDates={selectedDates}
                onNavigate={onCalendarNavigate}
                onToggleDate={onToggleDate}
              />
            </div>
          </div>

          <div className="flex space-x-4 mt-6 flex-shrink-0 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-md active:scale-95"
            >
              {editingProperty ? 'Update Property' : 'Add Property'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3.5 rounded-2xl font-bold transition-all duration-200 border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyModal;
