import { useState, useCallback } from 'react';
import { useProperties } from '../../../../context/PropertyContext';

export const usePropertyManagement = (propertyManagers) => {
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

  const handleAddProperty = useCallback(() => {
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
  }, []);

  const handleEditProperty = useCallback((property) => {
    setEditingProperty(property);
    setPropertyFormData({
      ...property,
      media: property.media || '',
      availability: property.availability || ''
    });
    setUploadedFiles(property.uploadedFiles || []);
    setSelectedDates(property.selectedDates || []);
    setPropertyFormErrors({});
    setShowPropertyModal(true);
  }, []);

  const handleDeleteProperty = useCallback(
    (id) => {
      if (window.confirm('Are you sure you want to delete this property?')) {
        deleteProperty(id);
      }
    },
    [deleteProperty]
  );

  const validatePropertyForm = useCallback(() => {
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
    const allowedDocTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

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
  }, [propertyFormData, uploadedFiles]);

  const handlePropertySubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!validatePropertyForm()) {
        const firstErrorField = document.querySelector('[data-error="true"]');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      const selectedManager = propertyManagers.find(
        (pm) => pm.email === propertyFormData.assignedTo
      );

      const propertyData = {
        ...propertyFormData,
        assignedToName: selectedManager ? selectedManager.name : '',
        uploadedFiles: uploadedFiles,
        selectedDates: selectedDates,
        media: uploadedFiles.map((f) => f.url || f.name).join(', ')
      };

      if (editingProperty) {
        updateProperty(editingProperty.id, propertyData);
      } else {
        addProperty(propertyData);
      }
      setShowPropertyModal(false);
      setPropertyFormErrors({});
    },
    [
      validatePropertyForm,
      propertyManagers,
      propertyFormData,
      uploadedFiles,
      selectedDates,
      editingProperty,
      updateProperty,
      addProperty
    ]
  );

  const handleFileUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      const maxFileSize = 10 * 1024 * 1024;
      const allowedDocTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
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

      const newFilesPromises = validFiles.map((file) => {
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

      Promise.all(newFilesPromises).then((fileData) => {
        setUploadedFiles((prev) => [...prev, ...fileData]);
      });

      e.target.value = '';
    },
    [propertyFormErrors, uploadedFiles.length]
  );

  const handleRemoveFile = useCallback((fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const handleCalendarNavigate = useCallback(
    (direction) => {
      if (direction === 'prev') {
        if (calendarMonth === 0) {
          setCalendarMonth(11);
          setCalendarYear((prev) => prev - 1);
        } else {
          setCalendarMonth((prev) => prev - 1);
        }
      } else {
        if (calendarMonth === 11) {
          setCalendarMonth(0);
          setCalendarYear((prev) => prev + 1);
        } else {
          setCalendarMonth((prev) => prev + 1);
        }
      }
    },
    [calendarMonth]
  );

  const toggleDateSelection = useCallback(
    (day) => {
      const dateKey = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dateObj = new Date(calendarYear, calendarMonth, day);

      setSelectedDates((prev) => {
        const existing = prev.find((d) => d.date === dateKey);
        if (existing) {
          if (existing.status === 'booked') {
            return prev.map((d) => (d.date === dateKey ? { ...d, status: 'available' } : d));
          } else if (existing.status === 'available') {
            return prev.filter((d) => d.date !== dateKey);
          }
        } else {
          return [...prev, { date: dateKey, status: 'booked', dateObj: dateObj.toISOString() }];
        }
        return prev;
      });
    },
    [calendarMonth, calendarYear]
  );

  return {
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
  };
};
