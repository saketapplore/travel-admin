import React, { useState, useEffect } from 'react';
import CustomTable from '../../../components/CustomTable';
import { bookingAPI } from '../../../services/api';

// Enums for filters
const PaymentStatus = {
  Pending: 'pending',
  Paid: 'paid',
  Failed: 'failed',
  Refunded: 'refunded'
};

const StatusEnum = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
  HOLD_FLIGHT: 'hold_flight',
  HOLD_FAILED: 'hold_failed'
};

const BookingType = {
  Flight: 'FLIGHT',
  Hotel: 'HOTEL',
  Property: 'PROPERTY'
};

const BookingManagement = () => {
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState('');
  
  // Filter states - Initialize from localStorage or use defaults
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem('bookingManagementFilters');
    if (savedFilters) {
      try {
        return JSON.parse(savedFilters);
      } catch (e) {
        console.error('Error parsing saved filters:', e);
      }
    }
    return {
      status: '',
      paymentStatus: '',
      bookingType: '',
      page: 1,
      limit: 10
    };
  });
  
  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showGuestDetailsModal, setShowGuestDetailsModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
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

  // Fetch bookings from API
  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await bookingAPI.getAll({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        paymentStatus: filters.paymentStatus,
        bookingType: filters.bookingType
      });
      
      // Handle various response structures
      const data = response?.data?.data || response?.data || {};
      const bookingsArray = Array.isArray(data) ? data : (data.bookings || data.items || []);
      
      // Normalize bookings data
      const normalizedBookings = bookingsArray.map(booking => ({
        id: booking._id || booking.id,
        bookingType: booking.bookingType || booking.type || booking.booking_type || 'N/A',
        status: booking.status || booking.bookingStatus || 'pending',
        username: booking.username || booking.user?.username || booking.guest?.username || booking.guestName || booking.user?.name || 'N/A',
        userEmail: booking.userEmail || booking.user?.email || booking.guestEmail || booking.guest?.email || '',
        country: booking.country || booking.user?.country || booking.guest?.country || 'N/A',
        totalAmount: booking.totalAmount || booking.amount || booking.price || 0,
        currency: booking.currency || booking.Currency || booking.bookingDetails?.Currency || booking.bookingDetails?.currency || 'N/A',
        bookingId: booking.bookingId || booking.booking_id || booking._id || booking.id || 'N/A',
        transactionId: booking.transactionId || booking.transaction_id || booking.transactionId || 'N/A',
        paymentStatus: booking.paymentStatus || booking.payment_status || 'pending',
        traceId: booking.TraceId || booking.traceId || booking.trace_id || booking.bookingDetails?.TraceId || 'N/A',
        // Keep old fields for backward compatibility with modals
        guestName: booking.guestName || booking.guest?.name || booking.user?.name || 'N/A',
        guestEmail: booking.guestEmail || booking.guest?.email || booking.user?.email || '',
        guestPhone: booking.guestPhone || booking.guest?.phone || booking.user?.phone || '',
        propertyName: booking.propertyName || booking.property?.name || booking.hotel?.name || 'N/A',
        propertyId: booking.propertyId || booking.property?._id || booking.property?.id,
        checkIn: booking.checkIn || booking.checkInDate || '',
        checkOut: booking.checkOut || booking.checkOutDate || '',
        guests: booking.guests || booking.numberOfGuests || 1,
        amount: booking.amount || booking.totalAmount || booking.price || 0,
        bookingStatus: booking.status || booking.bookingStatus || 'pending',
        idNumber: booking.idNumber || '',
        idPhoto: booking.idPhoto || '',
        createdAt: booking.createdAt || booking.created_at || '',
        notes: booking.notes || booking.remarks || '',
        familyMembers: booking.familyMembers || booking.guests || []
      }));
      
      setBookings(normalizedBookings);
      
      // Update pagination if available
      if (data.pagination || data.meta) {
        const paginationData = data.pagination || data.meta;
        const totalItems = paginationData.total || paginationData.totalItems || 0;
        const totalPages = paginationData.totalPages || Math.ceil(totalItems / filters.limit);
        setPagination({
          currentPage: paginationData.currentPage || paginationData.page || filters.page,
          totalPages: totalPages || 1,
          totalItems: totalItems
        });
      } else {
        // If API doesn't provide pagination metadata, estimate based on returned items
        // If we got exactly 'limit' items, assume there might be more pages
        const hasMorePages = bookingsArray.length === filters.limit;
        // Estimate total items: if we have a full page, assume at least (currentPage * limit) + 1 items
        const estimatedTotal = hasMorePages 
          ? (filters.page * filters.limit) + 1 
          : ((filters.page - 1) * filters.limit) + bookingsArray.length;
        const estimatedPages = hasMorePages 
          ? filters.page + 1 
          : filters.page;
        
        setPagination({
          currentPage: filters.page,
          totalPages: estimatedPages,
          totalItems: estimatedTotal
        });
      }
      
      setError('');
    } catch (error) {
      console.error('Bookings fetch error:', error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message || 
        'Failed to load bookings. Please try again.';
      setError(errorMessage);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBookingStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'hold_flight':
        return 'bg-orange-100 text-orange-800';
      case 'hold_failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value,
        page: 1 // Reset to first page when filter changes
      };
      // Save to localStorage
      localStorage.setItem('bookingManagementFilters', JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const bookingColumns = [
    {
      key: 'bookingType',
      header: 'Booking Type',
      accessor: 'bookingType',
      render: (value) => value || 'N/A',
      cellClassName: 'text-sm text-gray-700 font-medium'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBookingStatusColor(value)}`}>
          {formatStatus(value)}
        </span>
      ),
      cellClassName: 'text-sm'
    },
    {
      key: 'username',
      header: 'Username',
      accessor: 'username',
      render: (value) => value || 'N/A',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'userEmail',
      header: 'User Email',
      accessor: 'userEmail',
      render: (value) => value || 'N/A',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'country',
      header: 'Country',
      accessor: 'country',
      render: (value) => value || 'N/A',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      accessor: 'totalAmount',
      render: (value) => value || 0,
      cellClassName: 'text-sm text-gray-700 font-medium'
    },
    {
      key: 'currency',
      header: 'Currency',
      accessor: 'currency',
      render: (value) => value || 'N/A',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'bookingId',
      header: 'Booking ID',
      accessor: 'bookingId',
      render: (value) => (
        <span className="font-mono text-xs">{value || 'N/A'}</span>
      ),
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'transactionId',
      header: 'Transaction ID',
      accessor: 'transactionId',
      render: (value) => (
        <span className="font-mono text-xs">{value || 'N/A'}</span>
      ),
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      accessor: 'paymentStatus',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(value)}`}>
          {formatStatus(value)}
        </span>
      ),
      cellClassName: 'text-sm'
    },
    {
      key: 'traceId',
      header: 'Trace ID',
      accessor: 'traceId',
      render: (value) => (
        <span className="font-mono text-xs">{value || 'N/A'}</span>
      ),
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (row) => row,
      cellClassName: 'text-sm font-medium space-x-2',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewBooking(row);
            }}
            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Booking Details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleGenerateBookingInvoice(row);
            }}
            className="p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded-lg transition-colors"
            title="Generate & Download Invoice"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  // View Booking Details
  const handleViewBooking = async (booking) => {
    setViewModalOpen(true);
    setViewLoading(true);
    setViewError('');
    setSelectedBooking(null);
    
    try {
      const response = await bookingAPI.getById(booking.id);
      const bookingData = response?.data?.data || response?.data || response;
      setSelectedBooking(bookingData);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setViewError(err?.response?.data?.message || err?.message || 'Failed to fetch booking details');
    } finally {
      setViewLoading(false);
    }
  };

  // Booking Invoice Generation
  const handleGenerateBookingInvoice = (booking) => {
    const gstRate = 18;
    const subtotal = booking.amount;
    const gstAmount = (subtotal * gstRate) / 100;
    const totalAmount = subtotal + gstAmount;
    const invoiceNumber = `INV-BK-${String(booking.id).padStart(4, '0')}`;
    
    const invoiceData = {
      invoiceNumber: invoiceNumber,
      date: new Date().toLocaleDateString('en-IN'),
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      propertyName: booking.propertyName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      subtotal: subtotal,
      gstRate: gstRate,
      gstAmount: gstAmount,
      totalAmount: totalAmount,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      bookingDate: booking.createdAt
    };

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
          .booking-details { background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 20px 0; }
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
              <p><strong>Booking Date:</strong> ${invoiceData.bookingDate}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3>Bill To:</h3>
          <p><strong>${invoiceData.guestName}</strong></p>
          <p>${invoiceData.guestEmail}</p>
          <p>${invoiceData.guestPhone}</p>
        </div>
        
        <div class="booking-details">
          <h4>Booking Details:</h4>
          <p><strong>Property:</strong> ${invoiceData.propertyName}</p>
          <p><strong>Check In:</strong> ${invoiceData.checkIn}</p>
          <p><strong>Check Out:</strong> ${invoiceData.checkOut}</p>
          <p><strong>Number of Guests:</strong> ${invoiceData.guests}</p>
          <p><strong>Booking Status:</strong> ${invoiceData.bookingStatus}</p>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${invoiceData.propertyName} - ${invoiceData.checkIn} to ${invoiceData.checkOut}</td>
              <td>${invoiceData.checkIn}</td>
              <td>${invoiceData.checkOut}</td>
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

  const handleApproveBooking = async (id) => {
    try {
      // Update booking status via API if endpoint exists
      // await bookingAPI.update(id, { status: StatusEnum.CONFIRMED });
      await fetchBookings(); // Refresh list
    } catch (error) {
      console.error('Approve booking error:', error);
      setError('Failed to approve booking. Please try again.');
    }
  };

  const handleRejectBooking = async (id) => {
    try {
      // Update booking status via API if endpoint exists
      // await bookingAPI.update(id, { status: StatusEnum.CANCELLED });
      await fetchBookings(); // Refresh list
    } catch (error) {
      console.error('Reject booking error:', error);
      setError('Failed to reject booking. Please try again.');
    }
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

  const handleViewGuestDetails = (booking) => {
    setSelectedGuest(booking);
    setShowGuestDetailsModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      // Update booking via API
      await bookingAPI.update(editingBooking.id, bookingFormData);
      await fetchBookings(); // Refresh list
      setShowBookingModal(false);
      setEditingBooking(null);
    } catch (error) {
      console.error('Update booking error:', error);
      setError('Failed to update booking. Please try again.');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Management</h3>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Filters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value={StatusEnum.PENDING}>Pending</option>
                <option value={StatusEnum.CONFIRMED}>Confirmed</option>
                <option value={StatusEnum.CANCELLED}>Cancelled</option>
                <option value={StatusEnum.FAILED}>Failed</option>
                <option value={StatusEnum.HOLD_FLIGHT}>Hold Flight</option>
                <option value={StatusEnum.HOLD_FAILED}>Hold Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={filters.paymentStatus}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Payment Status</option>
                <option value={PaymentStatus.Pending}>Pending</option>
                <option value={PaymentStatus.Paid}>Paid</option>
                <option value={PaymentStatus.Failed}>Failed</option>
                <option value={PaymentStatus.Refunded}>Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
              <select
                value={filters.bookingType}
                onChange={(e) => handleFilterChange('bookingType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value={BookingType.Flight}>Flight</option>
                <option value={BookingType.Hotel}>Hotel</option>
                <option value={BookingType.Property}>Property</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Bookings List */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">All Bookings</h4>
          
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading bookings...</div>
          ) : (
            <>
              <CustomTable
                columns={bookingColumns}
                data={bookings}
                emptyMessage="No bookings found."
              />
              
              {/* Pagination */}
              {bookings.length > 0 && (
                <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    {(() => {
                      const startIndex = (filters.page - 1) * filters.limit;
                      const endIndex = Math.min(startIndex + filters.limit, pagination.totalItems || bookings.length);
                      const totalItems = pagination.totalItems || bookings.length;
                      return `Showing ${startIndex + 1} to ${endIndex} of ${totalItems} bookings`;
                    })()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        if (filters.page > 1) {
                          handlePageChange(filters.page - 1);
                        }
                      }}
                      disabled={filters.page <= 1}
                      className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                        filters.page <= 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => {
                        handlePageChange(filters.page + 1);
                      }}
                      disabled={bookings.length < filters.limit && filters.page >= (pagination.totalPages || 1)}
                      className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                        bookings.length < filters.limit && filters.page >= (pagination.totalPages || 1)
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>

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
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                  <select
                    value={bookingFormData.bookingStatus}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, bookingStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="failed">Failed</option>
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

      {/* Guest Details Modal */}
      {showGuestDetailsModal && selectedGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <h3 className="text-2xl font-bold text-gray-800">Guest Details - {selectedGuest.guestName}</h3>
              <button
                onClick={() => {
                  setShowGuestDetailsModal(false);
                  setSelectedGuest(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              {/* Primary Guest Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Primary Guest Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{selectedGuest.guestName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{selectedGuest.guestEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{selectedGuest.guestPhone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{selectedGuest.idNumber}</p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Booking Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{selectedGuest.propertyName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Guests</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{selectedGuest.guests}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{selectedGuest.checkIn}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                    <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">{selectedGuest.checkOut}</p>
                  </div>
                </div>
              </div>

              {/* Family Members */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  Family Members ({selectedGuest.familyMembers?.length || 0})
                </h4>
                {selectedGuest.familyMembers && selectedGuest.familyMembers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relation</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedGuest.familyMembers.map((member, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{member.phone}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {member.relation}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No family members registered for this booking.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6 flex-shrink-0 pt-4 border-t">
              <button
                onClick={() => {
                  setShowGuestDetailsModal(false);
                  setSelectedGuest(null);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Booking Details Modal */}
      {viewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <h3 className="text-2xl font-bold text-gray-800">Booking Details</h3>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedBooking(null);
                  setViewError('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {viewLoading ? (
                <div className="text-center py-8 text-gray-500">Loading booking details...</div>
              ) : viewError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {viewError}
                </div>
              ) : selectedBooking ? (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Basic Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
                        <p className="text-sm text-gray-900">{selectedBooking._id || selectedBooking.id || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                        <p className="text-sm text-gray-900">{selectedBooking.bookingType || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <p className="text-sm text-gray-900">{selectedBooking.status || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                        <p className="text-sm text-gray-900">{selectedBooking.paymentStatus || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
                        <p className="text-sm font-mono text-xs text-gray-900">{selectedBooking.transactionId || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trace ID</label>
                        <p className="text-sm font-mono text-xs text-gray-900">{selectedBooking.TraceId || selectedBooking.traceId || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                        <p className="text-sm text-gray-900">{selectedBooking.totalAmount || 0} {selectedBooking.currency || selectedBooking.Currency || ''}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                        <p className="text-sm font-mono text-xs text-gray-900">{selectedBooking.orderId || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  {selectedBooking.bookingDetails && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Booking Details</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(selectedBooking.bookingDetails, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Flight Details */}
                  {selectedBooking.bookingDetails?.flightDetails && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Flight Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                          <p className="text-sm text-gray-900">{selectedBooking.bookingDetails.flightDetails.Origin || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                          <p className="text-sm text-gray-900">{selectedBooking.bookingDetails.flightDetails.Destination || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                          <p className="text-sm text-gray-900">{selectedBooking.bookingDetails.flightDetails.AirlineName || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                          <p className="text-sm text-gray-900">{selectedBooking.bookingDetails.flightDetails.FlightNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">PNR</label>
                          <p className="text-sm text-gray-900">{selectedBooking.bookingDetails.flightDetails.PNR || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                          <p className="text-sm text-gray-900">
                            {selectedBooking.bookingDetails.flightDetails.DepartureTime 
                              ? new Date(selectedBooking.bookingDetails.flightDetails.DepartureTime).toLocaleString()
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hotel Details */}
                  {selectedBooking.bookingDetails?.hotelDetails && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Hotel Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                          <p className="text-sm text-gray-900">{selectedBooking.bookingDetails.hotelDetails.HotelName || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation Number</label>
                          <p className="text-sm text-gray-900">{selectedBooking.bookingDetails.hotelDetails.ConfirmationNo || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                          <p className="text-sm text-gray-900">{selectedBooking.bookingDetails.hotelDetails.checkIn || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                          <p className="text-sm text-gray-900">{selectedBooking.bookingDetails.hotelDetails.checkOut || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Timestamps</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                        <p className="text-sm text-gray-900">
                          {selectedBooking.createdAt 
                            ? new Date(selectedBooking.createdAt).toLocaleString()
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Updated At</label>
                        <p className="text-sm text-gray-900">
                          {selectedBooking.updatedAt 
                            ? new Date(selectedBooking.updatedAt).toLocaleString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No booking details available</div>
              )}
            </div>

            <div className="mt-6 flex justify-end flex-shrink-0">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedBooking(null);
                  setViewError('');
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default BookingManagement;



