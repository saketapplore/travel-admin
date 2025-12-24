import React, { useState } from 'react';
import CustomTable from '../../../components/CustomTable';
import { ViewIcon, EditIcon } from '../../../components/icons';

const BookingManagement = () => {
  const [bookingsSubSection, setBookingsSubSection] = useState('bookings');
  
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
      guests: 4,
      amount: 1500,
      paymentStatus: 'Paid',
      bookingStatus: 'Pending',
      idNumber: 'ID123456789',
      idPhoto: 'https://via.placeholder.com/300x200?text=ID+Photo+1',
      createdAt: '2024-01-10',
      notes: 'Guest requested early check-in',
      familyMembers: [
        { name: 'John Smith', email: 'john.smith@email.com', phone: '+1 234-567-8900', relation: 'Adult' },
        { name: 'Jane Smith', email: 'jane.smith@email.com', phone: '+1 234-567-8901', relation: 'Adult' },
        { name: 'Tom Smith', email: 'tom.smith@email.com', phone: '+1 234-567-8902', relation: 'Children' },
        { name: 'Emma Smith', email: 'emma.smith@email.com', phone: '+1 234-567-8903', relation: 'Children' }
      ]
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
      notes: 'Family with children',
      familyMembers: [
        { name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1 234-567-8901', relation: 'Adult' },
        { name: 'Mark Johnson', email: 'mark.j@email.com', phone: '+1 234-567-8904', relation: 'Adult' },
        { name: 'Lily Johnson', email: 'lily.j@email.com', phone: '+1 234-567-8905', relation: 'Children' },
        { name: 'Noah Johnson', email: 'noah.j@email.com', phone: '+1 234-567-8906', relation: 'Children' }
      ]
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
      notes: 'Honeymoon couple',
      familyMembers: [
        { name: 'Michael Brown', email: 'm.brown@email.com', phone: '+1 234-567-8902', relation: 'Adult' },
        { name: 'Sophia Brown', email: 'sophia.brown@email.com', phone: '+1 234-567-8907', relation: 'Adult' }
      ]
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
      notes: 'Booking cancelled by guest',
      familyMembers: [
        { name: 'Emily Davis', email: 'emily.d@email.com', phone: '+1 234-567-8903', relation: 'Adult' }
      ]
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
      notes: 'Large group booking',
      familyMembers: [
        { name: 'David Wilson', email: 'd.wilson@email.com', phone: '+1 234-567-8904', relation: 'Adult' },
        { name: 'Olivia Wilson', email: 'olivia.w@email.com', phone: '+1 234-567-8908', relation: 'Adult' },
        { name: 'James Wilson', email: 'james.w@email.com', phone: '+1 234-567-8909', relation: 'Children' },
        { name: 'Charlotte Wilson', email: 'charlotte.w@email.com', phone: '+1 234-567-8910', relation: 'Children' },
        { name: 'Robert Wilson', email: 'robert.w@email.com', phone: '+1 234-567-8911', relation: 'Adult' },
        { name: 'Mary Wilson', email: 'mary.w@email.com', phone: '+1 234-567-8912', relation: 'Adult' }
      ]
    }
  ]);
  
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

  const bookingColumns = [
    {
      key: 'guestName',
      header: 'Guest Name',
      accessor: (row) => row,
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewGuestDetails(row);
          }}
          className="text-blue-600 hover:text-blue-900 hover:underline cursor-pointer"
        >
          {row.guestName}
        </button>
      ),
      cellClassName: 'text-sm font-medium'
    },
    {
      key: 'propertyName',
      header: 'Property',
      accessor: 'propertyName',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'checkIn',
      header: 'Check In',
      accessor: 'checkIn',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'checkOut',
      header: 'Check Out',
      accessor: 'checkOut',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'amount',
      header: 'Amount',
      accessor: 'amount',
      render: (value) => `$${value}`,
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      accessor: 'paymentStatus',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'bookingStatus',
      header: 'Booking Status',
      accessor: 'bookingStatus',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBookingStatusColor(value)}`}>
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
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditBooking(row);
            }}
            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
            title="View/Edit"
          >
            <EditIcon className="w-5 h-5" />
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
          {row.bookingStatus === 'Pending' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproveBooking(row.id);
                }}
                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                title="Approve"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectBooking(row.id);
                }}
                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                title="Reject"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          )}
        </div>
      )
    }
  ];

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

  const handleApproveBooking = (id) => {
    const booking = bookings.find(b => b.id === id);
    setBookings(bookings.map(booking =>
      booking.id === id ? { ...booking, bookingStatus: 'Approved' } : booking
    ));
    
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
    
    if (notificationSettings.cancellations && booking) {
      sendNotification({
        type: 'Cancellation',
        recipient: booking.guestEmail,
        message: `Your booking for ${booking.propertyName} has been rejected. Please contact support for assistance.`,
        bookingId: booking.id
      });
    }
  };

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
    console.log('Sending notification:', newNotification);
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

  const handleViewGuestDetails = (booking) => {
    setSelectedGuest(booking);
    setShowGuestDetailsModal(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const oldBooking = bookings.find(b => b.id === editingBooking.id);
    const updatedBooking = { ...editingBooking, ...bookingFormData };
    
    setBookings(bookings.map(booking =>
      booking.id === editingBooking.id ? updatedBooking : booking
    ));
    
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

  return (
    <>
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
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800">All Bookings</h4>
        </div>

        <CustomTable
          columns={bookingColumns}
          data={bookings}
          emptyMessage="No bookings found."
        />
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
    </>
  );
};

export default BookingManagement;



