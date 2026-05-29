import React from 'react';
import { usePropertyManagement } from './usePropertyManagement';
import PropertyTable from './PropertyTable';
import PropertyModal from './PropertyModal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useState } from 'react';

const PropertyManagement = ({ propertyManagers }) => {
  const {
    properties,
    showPropertyModal,
    setShowPropertyModal,
    editingProperty,
    propertyFormData,
    setPropertyFormData,
    uploadedFiles,
    selectedDates,
    calendarMonth,
    calendarYear,
    propertyFormErrors,
    setPropertyFormErrors,
    handleAddProperty,
    handleEditProperty,
    handleDeleteProperty,
    handlePropertySubmit,
    handleFileUpload,
    handleRemoveFile,
    handleCalendarNavigate,
    toggleDateSelection
  } = usePropertyManagement(propertyManagers);

  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, propertyId: null });

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Property Management</h3>
          <button
            onClick={handleAddProperty}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 shadow-md active:scale-95"
          >
            + Add Property
          </button>
        </div>

        <PropertyTable
          properties={properties}
          onEdit={handleEditProperty}
          onDelete={(id) => setDeleteConfirm({ isOpen: true, propertyId: id })}
        />
      </div>

      <PropertyModal
        show={showPropertyModal}
        editingProperty={editingProperty}
        formData={propertyFormData}
        setFormData={setPropertyFormData}
        uploadedFiles={uploadedFiles}
        selectedDates={selectedDates}
        calendarMonth={calendarMonth}
        calendarYear={calendarYear}
        errors={propertyFormErrors}
        setErrors={setPropertyFormErrors}
        propertyManagers={propertyManagers}
        onClose={() => {
          setShowPropertyModal(false);
          setPropertyFormErrors({});
        }}
        onSubmit={handlePropertySubmit}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
        onCalendarNavigate={handleCalendarNavigate}
        onToggleDate={toggleDateSelection}
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Property?"
        message="Are you sure you want to delete this property? This action cannot be undone."
        confirmText="Delete Property"
        onConfirm={() => {
          handleDeleteProperty(deleteConfirm.propertyId);
          setDeleteConfirm({ isOpen: false, propertyId: null });
        }}
        onCancel={() => setDeleteConfirm({ isOpen: false, propertyId: null })}
        type="danger"
      />
    </>
  );
};

export default PropertyManagement;
