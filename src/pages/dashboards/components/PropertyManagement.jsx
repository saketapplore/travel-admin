import React, { useState } from 'react';
import { useProperties } from '../../../context/PropertyContext';
import CustomTable from '../../../components/CustomTable';
import { EditIcon, DeleteIcon } from '../../../components/icons';

const PropertyManagement = ({ propertyManagers }) => {
  const { properties, addProperty, updateProperty, deleteProperty } = useProperties();

  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [propertyFormData, setPropertyFormData] = useState({
    name: '',
    location: '',
    rooms: '',
    price: '',
    status: 'Available',
    assignedTo: '',
    assignedToName: '',
    description: '',
    amenities: '',
    media: '',
    availability: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [propertyFormErrors, setPropertyFormErrors] = useState({});

  const handleAddProperty = () => {
    setEditingProperty(null);
    setPropertyFormData({
      name: '',
      location: '',
      rooms: '',
      price: '',
      status: 'Available',
      assignedTo: '',
      assignedToName: '',
      description: '',
      amenities: '',
      media: '',
      availability: ''
    });
    setUploadedFiles([]);
    setSelectedDates([]);
    setCalendarMonth(new Date().getMonth());
    setCalendarYear(new Date().getFullYear());
    setPropertyFormErrors({});
    setShowPropertyModal(true);
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setPropertyFormData({
      ...property,
      media: property.media || '',
      availability: property.availability || ''
    });
    if (property.uploadedFiles) {
      setUploadedFiles(property.uploadedFiles);
    } else {
      setUploadedFiles([]);
    }
    if (property.selectedDates) {
      setSelectedDates(property.selectedDates);
    } else {
      setSelectedDates([]);
    }
    setPropertyFormErrors({});
    setShowPropertyModal(true);
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty(id);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Property Name',
      accessor: 'name',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'location',
      header: 'Location',
      accessor: 'location',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'rooms',
      header: 'Rooms',
      accessor: 'rooms',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'price',
      header: 'Price',
      accessor: 'price',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'assignedToName',
      header: 'Assigned To',
      accessor: 'assignedToName',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => row,
      cellClassName: 'text-sm font-medium space-x-2',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditProperty(row);
            }}
            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProperty(row.id);
            }}
            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <DeleteIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const validatePropertyForm = () => {
    const errors = {};
    
    if (!propertyFormData.name.trim()) {
      errors.name = 'Property name is required';
    } else if (propertyFormData.name.trim().length < 3) {
      errors.name = 'Property name must be at least 3 characters';
    }
    
    if (!propertyFormData.location.trim()) {
      errors.location = 'Location is required';
    } else if (propertyFormData.location.trim().length < 3) {
      errors.location = 'Location must be at least 3 characters';
    }
    
    if (!propertyFormData.rooms) {
      errors.rooms = 'Number of rooms is required';
    } else {
      const roomsNum = parseInt(propertyFormData.rooms);
      if (isNaN(roomsNum) || roomsNum < 1) {
        errors.rooms = 'Rooms must be a positive number';
      } else if (roomsNum > 100) {
        errors.rooms = 'Rooms cannot exceed 100';
      }
    }
    
    if (!propertyFormData.price.trim()) {
      errors.price = 'Price is required';
    } else {
      const priceMatch = propertyFormData.price.match(/[\d.]+/);
      if (!priceMatch) {
        errors.price = 'Please enter a valid price';
      } else {
        const priceNum = parseFloat(priceMatch[0]);
        if (isNaN(priceNum) || priceNum <= 0) {
          errors.price = 'Price must be greater than 0';
        }
      }
    }
    
    if (!propertyFormData.assignedTo) {
      errors.assignedTo = 'Please assign a property manager';
    }
    
    if (propertyFormData.description && propertyFormData.description.trim().length < 10) {
      errors.description = 'Description should be at least 10 characters if provided';
    }
    
    const maxFileSize = 10 * 1024 * 1024;
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    uploadedFiles.forEach((file, index) => {
      if (file.size > maxFileSize) {
        errors[`file_${index}`] = `${file.name} exceeds 10MB limit`;
      }
      if (!file.type.startsWith('image/') && !allowedDocTypes.includes(file.type)) {
        errors[`file_${index}`] = `${file.name} has an invalid file type`;
      }
    });
    
    setPropertyFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePropertySubmit = (e) => {
    e.preventDefault();
    
    if (!validatePropertyForm()) {
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    const selectedManager = propertyManagers.find(pm => pm.email === propertyFormData.assignedTo);
    
    const propertyData = {
      ...propertyFormData,
      assignedToName: selectedManager ? selectedManager.name : '',
      uploadedFiles: uploadedFiles,
      selectedDates: selectedDates,
      media: uploadedFiles.map(f => f.url || f.name).join(', ')
    };
    
    if (editingProperty) {
      updateProperty(editingProperty.id, propertyData);
    } else {
      addProperty(propertyData);
    }
    setShowPropertyModal(false);
    setPropertyFormErrors({});
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 10 * 1024 * 1024;
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const allowedDocTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const errors = { ...propertyFormErrors };
    
    const validFiles = [];
    files.forEach((file, index) => {
      if (file.size > maxFileSize) {
        errors[`file_${uploadedFiles.length + index}`] = `${file.name} exceeds 10MB limit`;
      } else if (!file.type.startsWith('image/') && !allowedDocTypes.includes(file.type)) {
        errors[`file_${uploadedFiles.length + index}`] = `${file.name} has an invalid file type`;
      } else {
        validFiles.push(file);
      }
    });
    
    if (Object.keys(errors).length > 0) {
      setPropertyFormErrors(errors);
    }
    
    const newFiles = validFiles.map(file => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size,
            url: reader.result,
            file: file
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newFiles).then(fileData => {
      setUploadedFiles(prev => [...prev, ...fileData]);
    });
    
    e.target.value = '';
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDateKey = (day, month, year) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateSelected = (day) => {
    const dateKey = formatDateKey(day, calendarMonth, calendarYear);
    return selectedDates.some(d => d.date === dateKey);
  };

  const toggleDateSelection = (day) => {
    const dateKey = formatDateKey(day, calendarMonth, calendarYear);
    const dateObj = new Date(calendarYear, calendarMonth, day);
    
    setSelectedDates(prev => {
      const existing = prev.find(d => d.date === dateKey);
      if (existing) {
        if (existing.status === 'booked') {
          return prev.map(d => d.date === dateKey ? { ...d, status: 'available' } : d);
        } else if (existing.status === 'available') {
          return prev.filter(d => d.date !== dateKey);
        }
      } else {
        return [...prev, { date: dateKey, status: 'booked', dateObj: dateObj.toISOString() }];
      }
      return prev;
    });
  };

  const getDateStatus = (day) => {
    const dateKey = formatDateKey(day, calendarMonth, calendarYear);
    const date = selectedDates.find(d => d.date === dateKey);
    return date ? date.status : null;
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const handleManagerSelect = (e) => {
    const managerEmail = e.target.value;
    const selectedManager = propertyManagers.find(pm => pm.email === managerEmail);
    setPropertyFormData({
      ...propertyFormData,
      assignedTo: managerEmail,
      assignedToName: selectedManager ? selectedManager.name : ''
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Property Management</h3>
          <button
            onClick={handleAddProperty}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            + Add Property
          </button>
        </div>

        <CustomTable
          columns={columns}
          data={properties}
          emptyMessage="No properties added yet. Click 'Add Property' to create one."
        />
      </div>

      {/* Property Modal */}
      {showPropertyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold mb-6 flex-shrink-0">
              {editingProperty ? 'Edit Property' : 'Add New Property'}
            </h3>
            <form onSubmit={handlePropertySubmit} className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={propertyFormData.name}
                    onChange={(e) => {
                      setPropertyFormData({ ...propertyFormData, name: e.target.value });
                      if (propertyFormErrors.name) {
                        setPropertyFormErrors({ ...propertyFormErrors, name: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      propertyFormErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    data-error={propertyFormErrors.name ? 'true' : 'false'}
                  />
                  {propertyFormErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{propertyFormErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={propertyFormData.location}
                    onChange={(e) => {
                      setPropertyFormData({ ...propertyFormData, location: e.target.value });
                      if (propertyFormErrors.location) {
                        setPropertyFormErrors({ ...propertyFormErrors, location: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      propertyFormErrors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                    data-error={propertyFormErrors.location ? 'true' : 'false'}
                  />
                  {propertyFormErrors.location && (
                    <p className="text-red-500 text-xs mt-1">{propertyFormErrors.location}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rooms <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={propertyFormData.rooms}
                    onChange={(e) => {
                      setPropertyFormData({ ...propertyFormData, rooms: e.target.value });
                      if (propertyFormErrors.rooms) {
                        setPropertyFormErrors({ ...propertyFormErrors, rooms: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      propertyFormErrors.rooms ? 'border-red-500' : 'border-gray-300'
                    }`}
                    data-error={propertyFormErrors.rooms ? 'true' : 'false'}
                  />
                  {propertyFormErrors.rooms && (
                    <p className="text-red-500 text-xs mt-1">{propertyFormErrors.rooms}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (per night) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={propertyFormData.price}
                    onChange={(e) => {
                      setPropertyFormData({ ...propertyFormData, price: e.target.value });
                      if (propertyFormErrors.price) {
                        setPropertyFormErrors({ ...propertyFormErrors, price: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      propertyFormErrors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="$200/night"
                    data-error={propertyFormErrors.price ? 'true' : 'false'}
                  />
                  {propertyFormErrors.price && (
                    <p className="text-red-500 text-xs mt-1">{propertyFormErrors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={propertyFormData.status}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, status: e.target.value })}
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
                    value={propertyFormData.assignedTo}
                    onChange={(e) => {
                      handleManagerSelect(e);
                      if (propertyFormErrors.assignedTo) {
                        setPropertyFormErrors({ ...propertyFormErrors, assignedTo: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      propertyFormErrors.assignedTo ? 'border-red-500' : 'border-gray-300'
                    }`}
                    data-error={propertyFormErrors.assignedTo ? 'true' : 'false'}
                  >
                    <option value="">Select Manager</option>
                    {propertyManagers.map((manager) => (
                      <option key={manager.id} value={manager.email}>
                        {manager.name} ({manager.email})
                      </option>
                    ))}
                  </select>
                  {propertyFormErrors.assignedTo && (
                    <p className="text-red-500 text-xs mt-1">{propertyFormErrors.assignedTo}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={propertyFormData.description}
                    onChange={(e) => {
                      setPropertyFormData({ ...propertyFormData, description: e.target.value });
                      if (propertyFormErrors.description) {
                        setPropertyFormErrors({ ...propertyFormErrors, description: '' });
                      }
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      propertyFormErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    rows="3"
                    placeholder="Enter property description (optional)"
                  />
                  {propertyFormErrors.description && (
                    <p className="text-red-500 text-xs mt-1">{propertyFormErrors.description}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                  <input
                    type="text"
                    value={propertyFormData.amenities}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, amenities: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Pool, WiFi, Kitchen"
                  />
                </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Media (images/documents)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center py-4"
                  >
                    <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm text-gray-600 font-medium">Click to upload images or documents</span>
                    <span className="text-xs text-gray-500 mt-1">Supports: Images (JPG, PNG, GIF) and Documents (PDF, DOC, DOCX)</span>
                  </label>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedFiles.map((file, index) => {
                      const fileError = propertyFormErrors[`file_${index}`];
                      return (
                        <div key={file.id} className="relative group">
                          {file.type.startsWith('image/') ? (
                            <div className="relative">
                              <img
                                src={file.url}
                                alt={file.name}
                                className={`w-full h-32 object-cover rounded-lg border ${
                                  fileError ? 'border-red-500' : 'border-gray-200'
                                }`}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(file.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div className={`border rounded-lg p-4 bg-gray-50 relative ${
                              fileError ? 'border-red-500' : 'border-gray-200'
                            }`}>
                              <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs text-gray-600 text-center truncate">{file.name}</p>
                              <button
                                type="button"
                                onClick={() => handleRemoveFile(file.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                          {fileError && (
                            <p className="text-red-500 text-xs mt-1">{fileError}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {Object.keys(propertyFormErrors).filter(key => key.startsWith('file_')).length > 0 && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-semibold text-red-700 mb-1">File Upload Errors:</p>
                    <ul className="text-xs text-red-600 list-disc list-inside">
                      {Object.keys(propertyFormErrors)
                        .filter(key => key.startsWith('file_'))
                        .map(key => (
                          <li key={key}>{propertyFormErrors[key]}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability Calendar</label>
                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {new Date(calendarYear, calendarMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: getFirstDayOfMonth(calendarMonth, calendarYear) }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="aspect-square"></div>
                    ))}
                    {Array.from({ length: getDaysInMonth(calendarMonth, calendarYear) }).map((_, idx) => {
                      const day = idx + 1;
                      const isSelected = isDateSelected(day);
                      const status = getDateStatus(day);
                      const isPast = new Date(calendarYear, calendarMonth, day) < new Date(new Date().setHours(0, 0, 0, 0));
                      
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => !isPast && toggleDateSelection(day)}
                          disabled={isPast}
                          className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                            isPast
                              ? 'text-gray-300 cursor-not-allowed'
                              : isSelected
                              ? status === 'booked'
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : status === 'available'
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          title={isPast ? 'Past date' : isSelected ? `${status} - Click to cycle: ${status === 'booked' ? 'available' : 'remove'}` : 'Click to mark as booked'}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 rounded"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span>Booked</span>
                    </div>
                    <div className="text-gray-500">Click dates to toggle status</div>
                  </div>

                  {selectedDates.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Selected Dates ({selectedDates.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedDates
                          .filter(d => {
                            const [y, m, day] = d.date.split('-').map(Number);
                            return m === calendarMonth + 1 && y === calendarYear;
                          })
                          .slice(0, 10)
                          .map((d, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2 py-1 rounded ${
                                d.status === 'booked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({d.status})
                            </span>
                          ))}
                        {selectedDates.filter(d => {
                          const [y, m] = d.date.split('-').map(Number);
                          return m === calendarMonth + 1 && y === calendarYear;
                        }).length > 10 && (
                          <span className="text-xs text-gray-500">+{selectedDates.filter(d => {
                            const [y, m] = d.date.split('-').map(Number);
                            return m === calendarMonth + 1 && y === calendarYear;
                          }).length - 10} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </div>
              <div className="flex space-x-3 mt-6 flex-shrink-0 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingProperty ? 'Update Property' : 'Add Property'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPropertyModal(false);
                    setPropertyFormErrors({});
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyManagement;



