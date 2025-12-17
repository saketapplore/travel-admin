import React, { useState, useEffect } from 'react';
import { useProperties } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const SuperAdminDashboard = () => {
  const { properties, propertyManagers, addProperty, updateProperty, deleteProperty } = useProperties();
  const { userAccounts, createAccount, updateAccount, deleteAccount } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleKey: 'property-manager',
    status: 'Active'
  });
  const [formError, setFormError] = useState('');

  // Active Section State
  const [activeSection, setActiveSection] = useState('properties');
  
  // Roles & Permissions Sub-section State
  const [rolesSubSection, setRolesSubSection] = useState('roles');

  // Booking Management Sub-section State
  const [bookingsSubSection, setBookingsSubSection] = useState('bookings');

  // Discounts & Packages State
  const [discounts, setDiscounts] = useState([
    {
      id: 1,
      code: 'SUMMER2024',
      type: 'Percentage',
      value: 20,
      description: 'Summer special discount',
      validFrom: '2024-06-01',
      validTo: '2024-08-31',
      minPurchase: 100,
      maxDiscount: 500,
      usageLimit: 100,
      usedCount: 45,
      status: 'Active'
    },
    {
      id: 2,
      code: 'WEEKEND50',
      type: 'Fixed',
      value: 50,
      description: 'Weekend getaway discount',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      minPurchase: 200,
      maxDiscount: null,
      usageLimit: 50,
      usedCount: 12,
      status: 'Active'
    }
  ]);
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Honeymoon Package',
      description: 'Special package for honeymooners with romantic amenities',
      price: 2999,
      duration: 7,
      includes: 'Breakfast, Spa, Romantic dinner, Room upgrade',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Family Fun Package',
      description: 'Perfect for families with kids',
      price: 1999,
      duration: 5,
      includes: 'Breakfast, Kids activities, Pool access, Family room',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      status: 'Active'
    }
  ]);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [discountFormData, setDiscountFormData] = useState({
    code: '',
    type: 'Percentage',
    value: '',
    description: '',
    validFrom: '',
    validTo: '',
    minPurchase: '',
    maxDiscount: '',
    usageLimit: '',
    status: 'Active'
  });
  const [packageFormData, setPackageFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    includes: '',
    validFrom: '',
    validTo: '',
    status: 'Active'
  });
  const [discountsSubSection, setDiscountsSubSection] = useState('discounts');

  // Financial Management State
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      bookingId: 'BK001',
      type: 'Property Booking',
      guestName: 'John Smith',
      propertyName: 'Sunset Villa',
      amount: 1500,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      transactionDate: '2024-01-15',
      gstAmount: 270,
      totalAmount: 1770,
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 2,
      type: 'Hotel Booking',
      guestName: 'Sarah Johnson',
      propertyName: 'Ocean View Resort',
      amount: 2800,
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'Pending',
      transactionDate: '2024-01-18',
      gstAmount: 504,
      totalAmount: 3304,
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 3,
      type: 'Flight Booking',
      guestName: 'Michael Brown',
      propertyName: 'Mountain Retreat',
      amount: 2100,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      transactionDate: '2024-01-20',
      gstAmount: 378,
      totalAmount: 2478,
      invoiceNumber: 'INV-2024-003'
    },
    {
      id: 4,
      type: 'Property Booking',
      guestName: 'Emily Davis',
      propertyName: 'Sunset Villa',
      amount: 400,
      paymentMethod: 'UPI',
      paymentStatus: 'Partial',
      transactionDate: '2024-01-22',
      gstAmount: 72,
      totalAmount: 472,
      invoiceNumber: 'INV-2024-004'
    },
    {
      id: 5,
      type: 'Hotel Booking',
      guestName: 'David Wilson',
      propertyName: 'Beach House',
      amount: 3500,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid',
      transactionDate: '2024-01-25',
      gstAmount: 630,
      totalAmount: 4130,
      invoiceNumber: 'INV-2024-005'
    }
  ]);
  const [financialFilters, setFinancialFilters] = useState({
    type: 'All',
    paymentStatus: 'All',
    dateFrom: '',
    dateTo: ''
  });

  // Reporting & Analytics State
  const [reportFilters, setReportFilters] = useState({
    dateFrom: '2024-01-01',
    dateTo: '2024-12-31',
    reportType: 'All'
  });
  const [reportingSubSection, setReportingSubSection] = useState('reports');
  
  // Sample analytics data
  const analyticsData = {
    nightsBooked: 245,
    revenueEarned: 83780,
    totalRooms: 50,
    occupiedRooms: 38,
    occupancyPercentage: 76,
    monthlyTrends: [
      { month: 'Jan', nights: 45, revenue: 12500, bookings: 12 },
      { month: 'Feb', nights: 52, revenue: 14500, bookings: 15 },
      { month: 'Mar', nights: 48, revenue: 13800, bookings: 14 },
      { month: 'Apr', nights: 55, revenue: 16200, bookings: 18 },
      { month: 'May', nights: 45, revenue: 13200, bookings: 13 }
    ]
  };

  const staffPerformance = [
    {
      id: 1,
      name: 'John Manager',
      role: 'Property Manager',
      assignedBookings: 25,
      completedTasks: 48,
      pendingTasks: 5,
      completionRate: 90.6,
      revenueGenerated: 45000
    },
    {
      id: 2,
      name: 'Sarah Coordinator',
      role: 'Booking Manager',
      assignedBookings: 32,
      completedTasks: 62,
      pendingTasks: 3,
      completionRate: 95.4,
      revenueGenerated: 58000
    },
    {
      id: 3,
      name: 'Mike Supervisor',
      role: 'Staff Manager',
      assignedBookings: 18,
      completedTasks: 35,
      pendingTasks: 8,
      completionRate: 81.4,
      revenueGenerated: 32000
    },
    {
      id: 4,
      name: 'Emily Assistant',
      role: 'Property Manager',
      assignedBookings: 20,
      completedTasks: 40,
      pendingTasks: 2,
      completionRate: 95.2,
      revenueGenerated: 38000
    }
  ];

  // Booking Management State
  const [bookings, setBookings] = useState([
    {
      id: 1,
      guestName: 'John Smith',
      guestEmail: 'john.smith@email.com',
      guestPhone: '+1 234-567-8900',
      propertyName: 'Sunset Villa',
      propertyId: 1,
      checkIn: '2024-02-15',
      checkOut: '2024-02-20',
      guests: 2,
      amount: 1500,
      paymentStatus: 'Paid',
      bookingStatus: 'Pending',
      idNumber: 'ID123456789',
      idPhoto: 'https://via.placeholder.com/300x200?text=ID+Photo+1',
      createdAt: '2024-01-10',
      notes: 'Guest requested early check-in'
    },
    {
      id: 2,
      guestName: 'Sarah Johnson',
      guestEmail: 'sarah.j@email.com',
      guestPhone: '+1 234-567-8901',
      propertyName: 'Ocean View Resort',
      propertyId: 2,
      checkIn: '2024-02-18',
      checkOut: '2024-02-25',
      guests: 4,
      amount: 2800,
      paymentStatus: 'Pending',
      bookingStatus: 'Pending',
      idNumber: 'ID987654321',
      idPhoto: 'https://via.placeholder.com/300x200?text=ID+Photo+2',
      createdAt: '2024-01-12',
      notes: 'Family with children'
    },
    {
      id: 3,
      guestName: 'Michael Brown',
      guestEmail: 'm.brown@email.com',
      guestPhone: '+1 234-567-8902',
      propertyName: 'Mountain Retreat',
      propertyId: 3,
      checkIn: '2024-02-20',
      checkOut: '2024-02-27',
      guests: 2,
      amount: 2100,
      paymentStatus: 'Paid',
      bookingStatus: 'Approved',
      idNumber: 'ID456789123',
      idPhoto: 'https://via.placeholder.com/300x200?text=ID+Photo+3',
      createdAt: '2024-01-08',
      notes: 'Honeymoon couple'
    },
    {
      id: 4,
      guestName: 'Emily Davis',
      guestEmail: 'emily.d@email.com',
      guestPhone: '+1 234-567-8903',
      propertyName: 'Sunset Villa',
      propertyId: 1,
      checkIn: '2024-02-22',
      checkOut: '2024-02-24',
      guests: 1,
      amount: 400,
      paymentStatus: 'Partial',
      bookingStatus: 'Rejected',
      idNumber: 'ID789123456',
      idPhoto: 'https://via.placeholder.com/300x200?text=ID+Photo+4',
      createdAt: '2024-01-15',
      notes: 'Booking cancelled by guest'
    },
    {
      id: 5,
      guestName: 'David Wilson',
      guestEmail: 'd.wilson@email.com',
      guestPhone: '+1 234-567-8904',
      propertyName: 'Beach House',
      propertyId: 4,
      checkIn: '2024-03-01',
      checkOut: '2024-03-08',
      guests: 6,
      amount: 3500,
      paymentStatus: 'Paid',
      bookingStatus: 'Approved',
      idNumber: 'ID321654987',
      idPhoto: 'https://via.placeholder.com/300x200?text=ID+Photo+5',
      createdAt: '2024-01-05',
      notes: 'Large group booking'
    }
  ]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingFormData, setBookingFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    propertyName: '',
    checkIn: '',
    checkOut: '',
    guests: '',
    amount: '',
    paymentStatus: 'Pending',
    bookingStatus: 'Pending',
    idNumber: '',
    notes: ''
  });

  // Push Notifications State
  const [notificationSettings, setNotificationSettings] = useState({
    confirmations: true,
    changes: true,
    cancellations: true,
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true
  });
  const [notificationHistory, setNotificationHistory] = useState([
    {
      id: 1,
      type: 'Confirmation',
      message: 'Booking #3 confirmed for Michael Brown',
      recipient: 'm.brown@email.com',
      status: 'Sent',
      timestamp: '2024-01-08 10:30 AM'
    },
    {
      id: 2,
      type: 'Cancellation',
      message: 'Booking #4 cancelled for Emily Davis',
      recipient: 'emily.d@email.com',
      status: 'Sent',
      timestamp: '2024-01-15 02:15 PM'
    }
  ]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationFormData, setNotificationFormData] = useState({
    type: 'Confirmation',
    recipient: '',
    message: '',
    bookingId: ''
  });

  // Permissions (API) State
  const [permissionsData, setPermissionsData] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsError, setPermissionsError] = useState('');
  const [permissionPage, setPermissionPage] = useState(1);
  const PERMISSION_PAGE_SIZE = 10;

  // Helper to render permission label safely
  const permissionLabel = (perm) =>
    perm?.name ||
    perm?.permissionName ||
    perm?.displayName ||
    perm?.title ||
    perm?.code ||
    perm?.slug ||
    perm?._id ||
    perm?.id ||
    (typeof perm === 'string' ? perm : JSON.stringify(perm));

  // Local editable tables for roles and permissions (UI only)
  const [rolesTable, setRolesTable] = useState([
    { id: 'role-1', name: 'Property Manager', description: 'Manages properties and listings' },
    { id: 'role-2', name: 'Booking Manager', description: 'Handles bookings and reservations' },
    { id: 'role-3', name: 'Staff Manager', description: 'Manages staff and assignments' },
    { id: 'role-4', name: 'Super Admin', description: 'Full system access' },
  ]);
  const [permissionsTable, setPermissionsTable] = useState([
    { id: 'perm-1', name: 'Manage Properties', description: 'Create, edit, and delete properties' },
    { id: 'perm-2', name: 'Manage Bookings', description: 'Handle booking lifecycle and payments' },
    { id: 'perm-3', name: 'Manage Staff', description: 'Onboard and manage staff assignments' },
    { id: 'perm-4', name: 'Create Accounts', description: 'Create new admin/staff accounts' },
    { id: 'perm-5', name: 'View Reports', description: 'Access analytics and reporting' },
  ]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ name: '', description: '' });
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [permissionForm, setPermissionForm] = useState({ name: '', description: '' });

  // Property Management State
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

  const handleCreateAdmin = () => {
    setEditingAdmin(null);
    setFormData({ name: '', email: '', password: '', roleKey: 'property-manager', status: 'Active' });
    setFormError('');
    setShowModal(true);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setFormData({ 
      name: admin.name, 
      email: admin.email, 
      password: admin.password,
      roleKey: admin.roleKey, 
      status: admin.status 
    });
    setFormError('');
    setShowModal(true);
  };

  const handleDeleteAdmin = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteAccount(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.password || formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    if (editingAdmin) {
      const result = updateAccount(editingAdmin.id, formData);
      if (result.success) {
        setShowModal(false);
      } else {
        setFormError(result.message);
      }
    } else {
      const result = createAccount(formData);
      if (result.success) {
        setShowModal(false);
      } else {
        setFormError(result.message);
      }
    }
  };

  // Property Management Handlers
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
    // Load uploaded files if they exist
    if (property.uploadedFiles) {
      setUploadedFiles(property.uploadedFiles);
    } else {
      setUploadedFiles([]);
    }
    // Load selected dates if they exist
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

  const validatePropertyForm = () => {
    const errors = {};
    
    // Property Name validation
    if (!propertyFormData.name.trim()) {
      errors.name = 'Property name is required';
    } else if (propertyFormData.name.trim().length < 3) {
      errors.name = 'Property name must be at least 3 characters';
    }
    
    // Location validation
    if (!propertyFormData.location.trim()) {
      errors.location = 'Location is required';
    } else if (propertyFormData.location.trim().length < 3) {
      errors.location = 'Location must be at least 3 characters';
    }
    
    // Rooms validation
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
    
    // Price validation
    if (!propertyFormData.price.trim()) {
      errors.price = 'Price is required';
    } else {
      // Extract numeric value from price string (e.g., "$200/night" -> 200)
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
    
    // Property Manager validation
    if (!propertyFormData.assignedTo) {
      errors.assignedTo = 'Please assign a property manager';
    }
    
    // Description validation (optional but if provided, should be meaningful)
    if (propertyFormData.description && propertyFormData.description.trim().length < 10) {
      errors.description = 'Description should be at least 10 characters if provided';
    }
    
    // File validation
    const maxFileSize = 10 * 1024 * 1024; // 10MB
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
    
    // Validate form
    if (!validatePropertyForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Find the selected property manager's name
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

  // File Upload Handlers
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 10 * 1024 * 1024; // 10MB
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
    
    // Clear file input
    e.target.value = '';
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // Calendar Handlers
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
        // Cycle through: booked -> available -> remove
        if (existing.status === 'booked') {
          return prev.map(d => d.date === dateKey ? { ...d, status: 'available' } : d);
        } else if (existing.status === 'available') {
          return prev.filter(d => d.date !== dateKey);
        }
      } else {
        // First click: set as booked
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

  // Fetch permissions when Permissions tab is active
  useEffect(() => {
    const fetchPermissions = async () => {
      if (rolesSubSection !== 'permissions') return;
      setPermissionsLoading(true);
      setPermissionsError('');
      try {
        const response = await api.get('/permission');
        const data = response?.data?.data || response?.data || [];
        setPermissionsData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Permissions fetch error:', error);
        // Don't show critical errors that would trigger logout
        if (error?.status === 401) {
          setPermissionsError('Authentication required. Please try refreshing the page.');
        } else {
          setPermissionsError(error?.message || 'Failed to load permissions. Using default permissions.');
        }
        // Set empty data on error to prevent undefined issues
        setPermissionsData([]);
      } finally {
        setPermissionsLoading(false);
      }
    };

    fetchPermissions();
  }, [rolesSubSection]);

  // When API permissions arrive, mirror them into local editable table (UI only)
  useEffect(() => {
    if (permissionsData && permissionsData.length > 0) {
      const mapped = permissionsData.map((perm, idx) => ({
        id: perm?._id || perm?.id || `api-perm-${idx}`,
        name: permissionLabel(perm),
        description:
          perm?.description ||
          perm?.details ||
          perm?.note ||
          'API permission',
      }));
      setPermissionsTable(mapped);
      setPermissionPage(1);
    }
  }, [permissionsData]);

  // Role table handlers (UI only)
  const handleAddRole = () => {
    setEditingRole(null);
    setRoleForm({ name: '', description: '' });
    setShowRoleModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setRoleForm({ name: role.name, description: role.description });
    setShowRoleModal(true);
  };

  const handleDeleteRole = (id) => {
    setRolesTable((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    if (!roleForm.name.trim()) return;
    if (editingRole) {
      setRolesTable((prev) =>
        prev.map((r) => (r.id === editingRole.id ? { ...r, ...roleForm } : r))
      );
    } else {
      setRolesTable((prev) => [
        ...prev,
        { id: `role-${Date.now()}`, ...roleForm },
      ]);
    }
    setShowRoleModal(false);
  };

  // Permission table handlers disabled (view-only)

  // Discounts & Packages Handlers
  const handleAddDiscount = () => {
    setEditingDiscount(null);
    setDiscountFormData({
      code: '',
      type: 'Percentage',
      value: '',
      description: '',
      validFrom: '',
      validTo: '',
      minPurchase: '',
      maxDiscount: '',
      usageLimit: '',
      status: 'Active'
    });
    setShowDiscountModal(true);
  };

  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount);
    setDiscountFormData({
      code: discount.code,
      type: discount.type,
      value: discount.value,
      description: discount.description,
      validFrom: discount.validFrom,
      validTo: discount.validTo,
      minPurchase: discount.minPurchase,
      maxDiscount: discount.maxDiscount || '',
      usageLimit: discount.usageLimit,
      status: discount.status
    });
    setShowDiscountModal(true);
  };

  const handleDeleteDiscount = (id) => {
    if (window.confirm('Are you sure you want to delete this discount code?')) {
      setDiscounts(discounts.filter(d => d.id !== id));
    }
  };

  const handleDiscountSubmit = (e) => {
    e.preventDefault();
    if (editingDiscount) {
      setDiscounts(discounts.map(d =>
        d.id === editingDiscount.id ? { ...discountFormData, id: editingDiscount.id, usedCount: editingDiscount.usedCount } : d
      ));
    } else {
      setDiscounts([...discounts, {
        ...discountFormData,
        id: Date.now(),
        usedCount: 0,
        value: parseFloat(discountFormData.value),
        minPurchase: parseFloat(discountFormData.minPurchase) || 0,
        maxDiscount: discountFormData.maxDiscount ? parseFloat(discountFormData.maxDiscount) : null,
        usageLimit: parseFloat(discountFormData.usageLimit) || 0
      }]);
    }
    setShowDiscountModal(false);
  };

  const handleAddPackage = () => {
    setEditingPackage(null);
    setPackageFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      includes: '',
      validFrom: '',
      validTo: '',
      status: 'Active'
    });
    setShowPackageModal(true);
  };

  const handleEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price,
      duration: pkg.duration,
      includes: pkg.includes,
      validFrom: pkg.validFrom,
      validTo: pkg.validTo,
      status: pkg.status
    });
    setShowPackageModal(true);
  };

  const handleDeletePackage = (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(p => p.id !== id));
    }
  };

  const handlePackageSubmit = (e) => {
    e.preventDefault();
    if (editingPackage) {
      setPackages(packages.map(p =>
        p.id === editingPackage.id ? { ...packageFormData, id: editingPackage.id, price: parseFloat(packageFormData.price), duration: parseFloat(packageFormData.duration) } : p
      ));
    } else {
      setPackages([...packages, {
        ...packageFormData,
        id: Date.now(),
        price: parseFloat(packageFormData.price),
        duration: parseFloat(packageFormData.duration)
      }]);
    }
    setShowPackageModal(false);
  };

  // Booking Management Handlers
  const handleApproveBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    setBookings(bookings.map(booking =>
      booking.id === id ? { ...booking, bookingStatus: 'Approved' } : booking
    ));
    
    // Send notification if enabled
    if (notificationSettings.confirmations && booking) {
      sendNotification({
        type: 'Confirmation',
        recipient: booking.guestEmail,
        message: `Your booking for ${booking.propertyName} has been confirmed! Check-in: ${booking.checkIn}`,
        bookingId: booking.id
      });
    }
  };

  const handleRejectBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    setBookings(bookings.map(booking =>
      booking.id === id ? { ...booking, bookingStatus: 'Rejected' } : booking
    ));
    
    // Send notification if enabled
    if (notificationSettings.cancellations && booking) {
      sendNotification({
        type: 'Cancellation',
        recipient: booking.guestEmail,
        message: `Your booking for ${booking.propertyName} has been rejected. Please contact support for assistance.`,
        bookingId: booking.id
      });
    }
  };

  // Push Notification Handlers
  const sendNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      status: 'Sent',
      timestamp: new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
    setNotificationHistory(prev => [newNotification, ...prev]);
    
    // In a real application, this would call an API to send the notification
    console.log('Sending notification:', newNotification);
    
    // Show success message
    alert(`Notification sent to ${notification.recipient}`);
  };

  const handleNotificationSettingsChange = (key, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSendManualNotification = (e) => {
    e.preventDefault();
    if (!notificationFormData.recipient || !notificationFormData.message) {
      alert('Please fill in all required fields');
      return;
    }
    sendNotification(notificationFormData);
    setNotificationFormData({
      type: 'Confirmation',
      recipient: '',
      message: '',
      bookingId: ''
    });
    setShowNotificationModal(false);
  };

  const handleEditBooking = (booking) => {
    setEditingBooking(booking);
    setBookingFormData({
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      propertyName: booking.propertyName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      amount: booking.amount,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      idNumber: booking.idNumber,
      notes: booking.notes || ''
    });
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const oldBooking = bookings.find(b => b.id === editingBooking.id);
    const updatedBooking = { ...editingBooking, ...bookingFormData };
    
    setBookings(bookings.map(booking =>
      booking.id === editingBooking.id ? updatedBooking : booking
    ));
    
    // Send notification if booking details changed and notifications are enabled
    if (notificationSettings.changes && oldBooking) {
      const hasChanges = 
        oldBooking.checkIn !== updatedBooking.checkIn ||
        oldBooking.checkOut !== updatedBooking.checkOut ||
        oldBooking.amount !== updatedBooking.amount ||
        oldBooking.bookingStatus !== updatedBooking.bookingStatus;
      
      if (hasChanges) {
        sendNotification({
          type: 'Change',
          recipient: updatedBooking.guestEmail,
          message: `Your booking for ${updatedBooking.propertyName} has been updated. Please check your booking details.`,
          bookingId: updatedBooking.id
        });
      }
    }
    
    setShowBookingModal(false);
    setEditingBooking(null);
  };

  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Reporting & Analytics helpers
  const isRevenueReport = reportFilters.reportType === 'All' || reportFilters.reportType === 'Revenue';
  const isOccupancyReport = reportFilters.reportType === 'All' || reportFilters.reportType === 'Occupancy';
  const isBookingsReport = reportFilters.reportType === 'All' || reportFilters.reportType === 'Bookings';

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Partial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Financial Management Handlers
  const handleGenerateInvoice = (transaction) => {
    // Generate invoice data
    const invoiceData = {
      invoiceNumber: transaction.invoiceNumber,
      date: new Date().toLocaleDateString('en-IN'),
      guestName: transaction.guestName,
      bookingType: transaction.type,
      propertyName: transaction.propertyName,
      subtotal: transaction.amount,
      gstRate: 18,
      gstAmount: transaction.gstAmount,
      totalAmount: transaction.totalAmount,
      paymentMethod: transaction.paymentMethod,
      paymentStatus: transaction.paymentStatus,
      transactionDate: transaction.transactionDate
    };

    // Create invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoiceData.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .invoice-header { border-bottom: 2px solid #f97316; padding-bottom: 20px; margin-bottom: 30px; }
          .invoice-title { font-size: 28px; color: #f97316; font-weight: bold; }
          .invoice-details { display: flex; justify-content: space-between; margin-top: 20px; }
          .company-info { flex: 1; }
          .invoice-info { flex: 1; text-align: right; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f97316; color: white; }
          .total-section { margin-top: 20px; text-align: right; }
          .total-row { font-size: 18px; font-weight: bold; padding: 10px 0; }
          .gst-info { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div class="invoice-title">TAX INVOICE</div>
          <div class="invoice-details">
            <div class="company-info">
              <h3>Travel Rumors</h3>
              <p>123 Travel Street, Tourism City</p>
              <p>GSTIN: 27AAAAA0000A1Z5</p>
              <p>Email: info@travelrumors.com</p>
            </div>
            <div class="invoice-info">
              <p><strong>Invoice No:</strong> ${invoiceData.invoiceNumber}</p>
              <p><strong>Date:</strong> ${invoiceData.date}</p>
              <p><strong>Transaction Date:</strong> ${invoiceData.transactionDate}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3>Bill To:</h3>
          <p><strong>${invoiceData.guestName}</strong></p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Booking Type</th>
              <th>Payment Method</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${invoiceData.propertyName}</td>
              <td>${invoiceData.bookingType}</td>
              <td>${invoiceData.paymentMethod}</td>
              <td>₹${invoiceData.subtotal.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="total-section">
          <div style="display: flex; justify-content: flex-end;">
            <div style="width: 300px;">
              <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                <span>Subtotal:</span>
                <span>₹${invoiceData.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 5px 0;">
                <span>GST (18%):</span>
                <span>₹${invoiceData.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div class="total-row" style="display: flex; justify-content: space-between; padding: 10px 0; border-top: 2px solid #f97316;">
                <span>Total Amount:</span>
                <span>₹${invoiceData.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="gst-info">
          <p><strong>Payment Status:</strong> ${invoiceData.paymentStatus}</p>
          <p>This is a computer-generated invoice and does not require a signature.</p>
          <p>GST Registration Number: 27AAAAA0000A1Z5</p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoiceData.invoiceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFilterTransactions = () => {
    // Filter logic
    return transactions.filter(transaction => {
      if (financialFilters.type !== 'All' && transaction.type !== financialFilters.type) return false;
      if (financialFilters.paymentStatus !== 'All' && transaction.paymentStatus !== financialFilters.paymentStatus) return false;
      if (financialFilters.dateFrom && transaction.transactionDate < financialFilters.dateFrom) return false;
      if (financialFilters.dateTo && transaction.transactionDate > financialFilters.dateTo) return false;
      return true;
    });
  };

  const filteredTransactions = handleFilterTransactions();

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      <aside className="lg:w-64 w-full mb-6 lg:mb-0">
        <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sections</h3>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('properties')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'properties'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏢 Property Management
            </button>
            <button
              onClick={() => setActiveSection('admins')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'admins'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              👥 Admin Accounts
            </button>
            <button
              onClick={() => {
                setActiveSection('roles');
                setRolesSubSection('roles');
              }}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'roles'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🔐 Roles & Permissions
            </button>
            <button
              onClick={() => setActiveSection('bookings')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'bookings'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📅 Booking Management
            </button>
            <button
              onClick={() => setActiveSection('discounts')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'discounts'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🎁 Discounts & Packages
            </button>
            <button
              onClick={() => setActiveSection('financial')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'financial'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              💰 Financial Management
            </button>
            <button
              onClick={() => setActiveSection('reporting')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'reporting'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📊 Reporting & Analytics
            </button>
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Super Admin Dashboard</h2>
         <p className="text-gray-600">
           {activeSection === 'properties' 
             ? 'Manage properties and assign them to property managers'
             : activeSection === 'admins'
             ? 'Create, edit, and delete admin accounts and assign roles/permissions'
             : activeSection === 'roles'
             ? 'Define roles and manage permissions for different user types'
             : activeSection === 'bookings'
             ? 'Approve or reject booking requests and manage booking details'
             : activeSection === 'discounts'
             ? 'Create promotional offers, discount codes, and custom packages for users'
             : activeSection === 'financial'
             ? 'View and track all transactions, generate GST-compliant invoices for bookings'
             : 'Generate reports on bookings, revenue, occupancy, and view staff performance metrics'}
         </p>
        </div>

      {/* Property Management Section */}
      {activeSection === 'properties' && (
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rooms</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{property.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.rooms}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.assignedToName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      property.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditProperty(property)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Admin Accounts Section */}
      {activeSection === 'admins' && (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Admin Accounts</h3>
          <button
            onClick={handleCreateAdmin}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            + Create New Account
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userAccounts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No accounts created yet. Click "Create New Account" to add one.
                  </td>
                </tr>
              ) : (
                userAccounts.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        admin.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditAdmin(admin)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAdmin(admin.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Roles Section */}
      {activeSection === 'roles' && (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Roles & Permissions</h3>
          
          {/* Toggle Buttons */}
          <div className="flex space-x-3 mb-4">
            <button
              onClick={() => setRolesSubSection('roles')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                rolesSubSection === 'roles'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👤 Roles
            </button>
            <button
              onClick={() => setRolesSubSection('permissions')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                rolesSubSection === 'permissions'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔐 Permissions
            </button>
          </div>

          <p className="text-sm text-gray-600">
            {rolesSubSection === 'roles' 
              ? 'Overview of all user roles and their capabilities in the system'
              : 'Detailed view of permissions across all roles'}
          </p>
        </div>

        {/* Roles Content */}
        {rolesSubSection === 'roles' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h4 className="font-semibold text-gray-800">Roles List</h4>
            <button
              onClick={handleAddRole}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200"
            >
              + Add Role
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rolesTable.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{role.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{role.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {rolesTable.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-6 text-center text-sm text-gray-500">No roles available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Permissions Content */}
        {rolesSubSection === 'permissions' && (
        <>
        {/* API-backed permission list */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">API Permissions</h4>
              <p className="text-sm text-gray-600">Live permissions from travel-rumours API</p>
            </div>
            {permissionsLoading && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
          </div>
          {permissionsError && (
            <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
              {permissionsError}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b">
            <h4 className="font-semibold text-gray-800">Permissions List</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissionsTable
                  .slice((permissionPage - 1) * PERMISSION_PAGE_SIZE, permissionPage * PERMISSION_PAGE_SIZE)
                  .map((perm) => (
                  <tr key={perm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{perm.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{perm.description}</td>
                  </tr>
                ))}
                {permissionsTable.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-6 py-6 text-center text-sm text-gray-500">No permissions available.</td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination */}
            {permissionsTable.length > PERMISSION_PAGE_SIZE && (
              <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-700">
                <span>
                  Showing {(permissionPage - 1) * PERMISSION_PAGE_SIZE + 1}-
                  {Math.min(permissionPage * PERMISSION_PAGE_SIZE, permissionsTable.length)} of {permissionsTable.length}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setPermissionPage((p) => Math.max(1, p - 1))}
                    disabled={permissionPage === 1}
                    className={`px-3 py-1 rounded border ${
                      permissionPage === 1
                        ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setPermissionPage((p) =>
                        p * PERMISSION_PAGE_SIZE < permissionsTable.length ? p + 1 : p
                      )
                    }
                    disabled={permissionPage * PERMISSION_PAGE_SIZE >= permissionsTable.length}
                    className={`px-3 py-1 rounded border ${
                      permissionPage * PERMISSION_PAGE_SIZE >= permissionsTable.length
                        ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>
      )}

      {/* Booking Management Section */}
      {activeSection === 'bookings' && (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Management</h3>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setBookingsSubSection('bookings')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                bookingsSubSection === 'bookings'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📅 Bookings
            </button>
            <button
              onClick={() => setBookingsSubSection('notifications')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                bookingsSubSection === 'notifications'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔔 Push Notifications
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {bookingsSubSection === 'bookings' && (
        <>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-800">All Bookings</h4>
          <div className="flex space-x-2">
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition duration-200">
              Filter
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.guestName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.propertyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${booking.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBookingStatusColor(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditBooking(booking)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View/Edit
                    </button>
                    {booking.bookingStatus === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApproveBooking(booking.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectBooking(booking.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        )}

        {/* Push Notifications Section */}
        {bookingsSubSection === 'notifications' && (
        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Enable notifications for:</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.confirmations}
                      onChange={(e) => handleNotificationSettingsChange('confirmations', e.target.checked)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Booking Confirmations</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.changes}
                      onChange={(e) => handleNotificationSettingsChange('changes', e.target.checked)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Booking Changes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.cancellations}
                      onChange={(e) => handleNotificationSettingsChange('cancellations', e.target.checked)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Booking Cancellations</span>
                  </label>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Notification Channels:</p>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailEnabled}
                      onChange={(e) => handleNotificationSettingsChange('emailEnabled', e.target.checked)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsEnabled}
                      onChange={(e) => handleNotificationSettingsChange('smsEnabled', e.target.checked)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">SMS Notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushEnabled}
                      onChange={(e) => handleNotificationSettingsChange('pushEnabled', e.target.checked)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Push Notifications</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Send Manual Notification */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Send Manual Notification</h4>
              <button
                onClick={() => {
                  setNotificationFormData({
                    type: 'Confirmation',
                    recipient: '',
                    message: '',
                    bookingId: ''
                  });
                  setShowNotificationModal(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
              >
                + Send Notification
              </button>
            </div>
            <p className="text-sm text-gray-600">Manually trigger push notifications for specific bookings or events</p>
          </div>

          {/* Notification History */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Notification History</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notificationHistory.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No notifications sent yet
                      </td>
                    </tr>
                  ) : (
                    notificationHistory.map((notification) => (
                      <tr key={notification.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            notification.type === 'Confirmation' ? 'bg-green-100 text-green-800' :
                            notification.type === 'Cancellation' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {notification.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notification.recipient}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">{notification.message}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            notification.status === 'Sent' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {notification.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notification.timestamp}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}
      </div>
      )}

      {/* Discounts & Packages Section */}
      {activeSection === 'discounts' && (
      <div className="bg-white rounded-lg shadow-md p-6 w-full">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Discounts & Packages</h3>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setDiscountsSubSection('discounts')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                discountsSubSection === 'discounts'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🎫 Discount Codes
            </button>
            <button
              onClick={() => setDiscountsSubSection('packages')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                discountsSubSection === 'packages'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📦 Packages
            </button>
          </div>
        </div>

        {/* Discount Codes Section */}
        {discountsSubSection === 'discounts' && (
        <>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-800">Discount Codes</h4>
          <button
            onClick={handleAddDiscount}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            + Create Discount Code
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {discounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">{discount.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{discount.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.type === 'Percentage' ? `${discount.value}%` : `$${discount.value}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{discount.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.validFrom} to {discount.validTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {discount.usedCount} / {discount.usageLimit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      discount.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {discount.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditDiscount(discount)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDiscount(discount.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        )}

        {/* Packages Section */}
        {discountsSubSection === 'packages' && (
        <>
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-800">Custom Packages</h4>
          <button
            onClick={handleAddPackage}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            + Create Package
          </button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Includes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 min-w-[180px]">{pkg.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 min-w-[200px] max-w-[300px]">{pkg.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">${pkg.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pkg.duration} days</td>
                  <td className="px-6 py-4 text-sm text-gray-500 min-w-[200px] max-w-[300px]">{pkg.includes}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 min-w-[180px]">
                    <div className="flex flex-col">
                      <span>{pkg.validFrom}</span>
                      <span className="text-gray-400 text-xs">to</span>
                      <span>{pkg.validTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pkg.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEditPackage(pkg)}
                      className="text-blue-600 hover:text-blue-900 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="text-red-600 hover:text-red-900 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
        )}
      </div>
      )}

      {/* Financial Management Section */}
      {activeSection === 'financial' && (
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-full overflow-hidden">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Financial Management</h3>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-5 border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  ₹{transactions.filter(t => t.paymentStatus === 'Paid').reduce((sum, t) => sum + t.totalAmount, 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-3xl lg:text-4xl ml-3">💰</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-5 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Total GST</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  ₹{transactions.filter(t => t.paymentStatus === 'Paid').reduce((sum, t) => sum + t.gstAmount, 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-3xl lg:text-4xl ml-3">📊</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-5 border border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Pending Payments</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                  ₹{transactions.filter(t => t.paymentStatus === 'Pending' || t.paymentStatus === 'Partial').reduce((sum, t) => sum + t.amount, 0).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-3xl lg:text-4xl ml-3">⏳</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-5 border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-gray-600 text-sm font-medium mb-1">Total Transactions</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-800">{transactions.length}</p>
              </div>
              <div className="text-3xl lg:text-4xl ml-3">📈</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
              <select
                value={financialFilters.type}
                onChange={(e) => setFinancialFilters({ ...financialFilters, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All Types</option>
                <option value="Property Booking">Property Booking</option>
                <option value="Hotel Booking">Hotel Booking</option>
                <option value="Flight Booking">Flight Booking</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={financialFilters.paymentStatus}
                onChange={(e) => setFinancialFilters({ ...financialFilters, paymentStatus: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
              <input
                type="date"
                value={financialFilters.dateFrom}
                onChange={(e) => setFinancialFilters({ ...financialFilters, dateFrom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
              <input
                type="date"
                value={financialFilters.dateTo}
                onChange={(e) => setFinancialFilters({ ...financialFilters, dateTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[1400px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Invoice No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">Transaction Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">Guest Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">Booking Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[160px]">Property/Hotel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Subtotal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">GST (18%)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">Total Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[130px]">Payment Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 font-mono">
                      {transaction.invoiceNumber}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.transactionDate}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {transaction.guestName}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {transaction.type}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {transaction.propertyName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      ₹{transaction.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      ₹{transaction.gstAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{transaction.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(transaction.paymentStatus)}`}>
                        {transaction.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleGenerateInvoice(transaction)}
                        className="text-orange-600 hover:text-orange-900 font-medium px-2 py-1 rounded hover:bg-orange-50 transition"
                        title="Generate & Download Invoice"
                      >
                        📄 Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Export Options */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => {
              // Export to CSV functionality
              const csvContent = [
                ['Invoice No', 'Date', 'Guest', 'Type', 'Property', 'Subtotal', 'GST', 'Total', 'Payment Method', 'Status'],
                ...filteredTransactions.map(t => [
                  t.invoiceNumber,
                  t.transactionDate,
                  t.guestName,
                  t.type,
                  t.propertyName,
                  t.amount,
                  t.gstAmount,
                  t.totalAmount,
                  t.paymentMethod,
                  t.paymentStatus
                ])
              ].map(row => row.join(',')).join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `Transactions_${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            📊 Export to CSV
          </button>
        </div>
      </div>
      )}

      {/* Reporting & Analytics Section */}
      {activeSection === 'reporting' && (
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-full overflow-hidden">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Reporting & Analytics</h3>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setReportingSubSection('reports')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                reportingSubSection === 'reports'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📈 Reports
            </button>
            <button
              onClick={() => setReportingSubSection('staff')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                reportingSubSection === 'staff'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👥 Staff Performance
            </button>
          </div>
        </div>

        {/* Reports Section */}
        {reportingSubSection === 'reports' && (
        <>
        {/* Date Filters */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
              <input
                type="date"
                value={reportFilters.dateFrom}
                onChange={(e) => setReportFilters({ ...reportFilters, dateFrom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
              <input
                type="date"
                value={reportFilters.dateTo}
                onChange={(e) => setReportFilters({ ...reportFilters, dateTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={reportFilters.reportType}
                onChange={(e) => setReportFilters({ ...reportFilters, reportType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All Reports</option>
                <option value="Revenue">Revenue Report</option>
                <option value="Occupancy">Occupancy Report</option>
                <option value="Bookings">Bookings Report</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {(isBookingsReport || isOccupancyReport) && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-5 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium mb-1">Nights Booked</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                    {analyticsData.nightsBooked}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total nights</p>
                </div>
                <div className="text-3xl lg:text-4xl ml-3">🌙</div>
              </div>
            </div>
          )}

          {isRevenueReport && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-5 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium mb-1">Revenue Earned</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                    ₹{analyticsData.revenueEarned.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total revenue</p>
                </div>
                <div className="text-3xl lg:text-4xl ml-3">💰</div>
              </div>
            </div>
          )}

          {isOccupancyReport && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md p-5 border border-purple-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium mb-1">Occupancy %</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                    {analyticsData.occupancyPercentage}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {analyticsData.occupiedRooms}/{analyticsData.totalRooms} rooms
                  </p>
                </div>
                <div className="text-3xl lg:text-4xl ml-3">📊</div>
              </div>
            </div>
          )}

          {isBookingsReport && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg shadow-md p-5 border border-orange-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Bookings</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-800">
                    {analyticsData.monthlyTrends.reduce((sum, m) => sum + m.bookings, 0)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>
                <div className="text-3xl lg:text-4xl ml-3">📅</div>
              </div>
            </div>
          )}
        </div>

        {/* Booking Trends Chart */}
        {(isBookingsReport || isOccupancyReport) && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Booking Trends</h4>
            <div className="space-y-4">
              {analyticsData.monthlyTrends.map((month, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{month.month}</span>
                    <span className="text-sm text-gray-500">{month.bookings} bookings</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-orange-500 h-4 rounded-full"
                      style={{ width: `${(month.bookings / 20) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{month.nights} nights</span>
                    <span>₹{month.revenue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Revenue Chart */}
        {isRevenueReport && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trends</h4>
            <div className="space-y-4">
              {analyticsData.monthlyTrends.map((month, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{month.month}</span>
                    <span className="text-sm font-semibold text-gray-800">
                      ₹{month.revenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${(month.revenue / 20000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              const reportData = {
                period: `${reportFilters.dateFrom} to ${reportFilters.dateTo}`,
                nightsBooked: analyticsData.nightsBooked,
                revenueEarned: analyticsData.revenueEarned,
                occupancyPercentage: analyticsData.occupancyPercentage,
                monthlyTrends: analyticsData.monthlyTrends
              };
              const reportText = `
REPORTING & ANALYTICS REPORT
Period: ${reportData.period}

KEY METRICS:
- Nights Booked: ${reportData.nightsBooked}
- Revenue Earned: ₹${reportData.revenueEarned.toLocaleString('en-IN')}
- Occupancy Percentage: ${reportData.occupancyPercentage}%
- Total Rooms: ${analyticsData.totalRooms}
- Occupied Rooms: ${analyticsData.occupiedRooms}

MONTHLY TRENDS:
${reportData.monthlyTrends.map(m => `${m.month}: ${m.bookings} bookings, ${m.nights} nights, ₹${m.revenue.toLocaleString('en-IN')}`).join('\n')}

Generated on: ${new Date().toLocaleString('en-IN')}
              `;
              const blob = new Blob([reportText], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `Analytics_Report_${new Date().toISOString().split('T')[0]}.txt`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            📄 Export Report
          </button>
        </div>
        </>
        )}

        {/* Staff Performance Section */}
        {reportingSubSection === 'staff' && (
        <>
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Staff Performance Metrics</h4>
          <p className="text-sm text-gray-600">View performance metrics based on assigned bookings and tasks completed</p>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Bookings</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Tasks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Tasks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffPerformance.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">{staff.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">{staff.role}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {staff.assignedBookings}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {staff.completedTasks}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {staff.pendingTasks}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            staff.completionRate >= 90 ? 'bg-green-500' :
                            staff.completionRate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${staff.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{staff.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ₹{staff.revenueGenerated.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export Staff Performance */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => {
              const csvContent = [
                ['Staff Name', 'Role', 'Assigned Bookings', 'Completed Tasks', 'Pending Tasks', 'Completion Rate %', 'Revenue Generated'],
                ...staffPerformance.map(s => [
                  s.name,
                  s.role,
                  s.assignedBookings,
                  s.completedTasks,
                  s.pendingTasks,
                  s.completionRate,
                  s.revenueGenerated
                ])
              ].map(row => row.join(',')).join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `Staff_Performance_${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            📊 Export to CSV
          </button>
        </div>
        </>
        )}
      </div>
      )}

      {/* Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">
              {editingAdmin ? 'Edit Account' : 'Create New Account'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={editingAdmin}
                    required
                  />
                  {editingAdmin && (
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={editingAdmin ? "Enter new password to change" : "Enter password"}
                    required={!editingAdmin}
                    minLength="6"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={formData.roleKey}
                    onChange={(e) => setFormData({ ...formData, roleKey: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="property-manager">Property Manager</option>
                    <option value="booking-manager">Booking Manager</option>
                    <option value="staff-manager">Staff Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingAdmin ? 'Update' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                
                {/* File Previews */}
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
                {/* Display file upload errors */}
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
                  {/* Calendar Header */}
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

                  {/* Calendar Grid */}
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

                  {/* Legend */}
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

                  {/* Selected Dates Summary */}
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

      {/* Booking Modal */}
      {showBookingModal && editingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold mb-6 flex-shrink-0">Booking Details - {editingBooking.guestName}</h3>
            <form onSubmit={handleBookingSubmit} className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                {/* Guest Information */}
                <div className="col-span-2">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Guest Information</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guest Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={bookingFormData.guestName}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, guestName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guest Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={bookingFormData.guestEmail}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, guestEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guest Phone</label>
                  <input
                    type="tel"
                    value={bookingFormData.guestPhone}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, guestPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Number <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={bookingFormData.idNumber}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, idNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
                    required
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">ID Number: {editingBooking.idNumber}</p>
                </div>

                {/* ID Photo Display */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Photo</label>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <img
                      src={editingBooking.idPhoto}
                      alt="ID Photo"
                      className="w-full max-w-md mx-auto rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="hidden text-center text-gray-500 py-8">
                      <p>Failed to load ID photo</p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="col-span-2 mt-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Booking Details</h4>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
                  <input
                    type="text"
                    value={bookingFormData.propertyName}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, propertyName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests</label>
                  <input
                    type="number"
                    min="1"
                    value={bookingFormData.guests}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, guests: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check In Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={bookingFormData.checkIn}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, checkIn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check Out Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={bookingFormData.checkOut}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, checkOut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={bookingFormData.amount}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                  <select
                    value={bookingFormData.paymentStatus}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, paymentStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                  <select
                    value={bookingFormData.bookingStatus}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, bookingStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={bookingFormData.notes}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Additional notes about this booking..."
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6 flex-shrink-0 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  Update Booking
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false);
                    setEditingBooking(null);
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

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">Send Push Notification</h3>
            <form onSubmit={handleSendManualNotification}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type <span className="text-red-500">*</span></label>
                  <select
                    value={notificationFormData.type}
                    onChange={(e) => setNotificationFormData({ ...notificationFormData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="Confirmation">Confirmation</option>
                    <option value="Change">Change</option>
                    <option value="Cancellation">Cancellation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    value={notificationFormData.recipient}
                    onChange={(e) => setNotificationFormData({ ...notificationFormData, recipient: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="guest@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking ID (Optional)</label>
                  <input
                    type="text"
                    value={notificationFormData.bookingId}
                    onChange={(e) => setNotificationFormData({ ...notificationFormData, bookingId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Booking ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message <span className="text-red-500">*</span></label>
                  <textarea
                    value={notificationFormData.message}
                    onChange={(e) => setNotificationFormData({ ...notificationFormData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="4"
                    placeholder="Enter notification message..."
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  Send Notification
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNotificationModal(false);
                    setNotificationFormData({
                      type: 'Confirmation',
                      recipient: '',
                      message: '',
                      bookingId: ''
                    });
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

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold mb-6 flex-shrink-0">
              {editingDiscount ? 'Edit Discount Code' : 'Create Discount Code'}
            </h3>
            <form onSubmit={handleDiscountSubmit} className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Discount Code <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={discountFormData.code}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                    placeholder="SUMMER2024"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type <span className="text-red-500">*</span></label>
                  <select
                    value={discountFormData.type}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  >
                    <option value="Percentage">Percentage (%)</option>
                    <option value="Fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Value <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountFormData.value}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, value: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={discountFormData.type === 'Percentage' ? '20' : '50'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Purchase ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={discountFormData.minPurchase}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, minPurchase: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                {discountFormData.type === 'Percentage' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Discount ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={discountFormData.maxDiscount}
                      onChange={(e) => setDiscountFormData({ ...discountFormData, maxDiscount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                  <input
                    type="number"
                    min="0"
                    value={discountFormData.usageLimit}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, usageLimit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid From <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={discountFormData.validFrom}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid To <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={discountFormData.validTo}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, validTo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={discountFormData.status}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={discountFormData.description}
                    onChange={(e) => setDiscountFormData({ ...discountFormData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter discount description..."
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6 flex-shrink-0 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingDiscount ? 'Update Discount' : 'Create Discount'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDiscountModal(false);
                    setEditingDiscount(null);
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

      {/* Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold mb-6 flex-shrink-0">
              {editingPackage ? 'Edit Package' : 'Create Package'}
            </h3>
            <form onSubmit={handlePackageSubmit} className="flex-1 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Package Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={packageFormData.name}
                    onChange={(e) => setPackageFormData({ ...packageFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Honeymoon Package"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea
                    value={packageFormData.description}
                    onChange={(e) => setPackageFormData({ ...packageFormData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Enter package description..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={packageFormData.price}
                    onChange={(e) => setPackageFormData({ ...packageFormData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="2999"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min="1"
                    value={packageFormData.duration}
                    onChange={(e) => setPackageFormData({ ...packageFormData, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="7"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Includes <span className="text-red-500">*</span></label>
                  <textarea
                    value={packageFormData.includes}
                    onChange={(e) => setPackageFormData({ ...packageFormData, includes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Breakfast, Spa, Romantic dinner, Room upgrade"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate items with commas</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid From <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={packageFormData.validFrom}
                    onChange={(e) => setPackageFormData({ ...packageFormData, validFrom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valid To <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={packageFormData.validTo}
                    onChange={(e) => setPackageFormData({ ...packageFormData, validTo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={packageFormData.status}
                    onChange={(e) => setPackageFormData({ ...packageFormData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6 flex-shrink-0 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPackageModal(false);
                    setEditingPackage(null);
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

      {/* Role Modal (UI only) */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">
              {editingRole ? 'Edit Role' : 'Add Role'}
            </h3>
            <form onSubmit={handleRoleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingRole ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default SuperAdminDashboard;