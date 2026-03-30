import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '@/services/bookingService';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [showGuestDetailsModal, setShowGuestDetailsModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedUserDocs, setSelectedUserDocs] = useState(null);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [documentError, setDocumentError] = useState('');

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

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await bookingService.getAll({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        paymentStatus: filters.paymentStatus,
        bookingType: filters.bookingType
      });

      const data = response?.data?.data || response?.data || {};
      const bookingsArray = Array.isArray(data) ? data : data.bookings || data.items || [];

      const normalizedBookings = bookingsArray.map((booking) => ({
        id: booking._id || booking.id,
        _id: booking._id || booking.id,
        bookingType: booking.bookingType || booking.type || booking.booking_type || 'N/A',
        status: booking.status || booking.bookingStatus || 'pending',
        username:
          booking.username ||
          booking.user?.username ||
          booking.guest?.username ||
          booking.guestName ||
          booking.user?.name ||
          'N/A',
        userEmail:
          booking.userEmail ||
          booking.user?.email ||
          booking.guestEmail ||
          booking.guest?.email ||
          '',
        country: booking.country || booking.user?.country || booking.guest?.country || 'N/A',
        totalAmount: booking.totalAmount || booking.amount || booking.price || 0,
        currency:
          booking.currency ||
          booking.Currency ||
          booking.bookingDetails?.Currency ||
          booking.bookingDetails?.currency ||
          'N/A',
        bookingId: booking.bookingId || booking.booking_id || 'N/A',
        transactionId:
          booking.transactionId || booking.transaction_id || booking.transactionId || 'N/A',
        paymentStatus: booking.paymentStatus || booking.payment_status || 'pending',
        traceId:
          booking.TraceId ||
          booking.traceId ||
          booking.trace_id ||
          booking.bookingDetails?.TraceId ||
          'N/A',
        guestName: booking.guestName || booking.guest?.name || booking.user?.name || 'N/A',
        guestEmail: booking.guestEmail || booking.guest?.email || booking.user?.email || '',
        guestPhone: booking.guestPhone || booking.guest?.phone || booking.user?.phone || '',
        propertyName:
          booking.propertyName || booking.property?.name || booking.hotel?.name || 'N/A',
        propertyId: booking.propertyId || booking.property?._id || booking.property?.id,
        checkIn: booking.checkIn || booking.checkInDate || '',
        checkOut: booking.checkOut || booking.checkOutDate || '',
        guests: booking.guests || booking.numberOfGuests || 1,
        amount: booking.amount || booking.totalAmount || booking.price || 0,
        bookingStatus: booking.status || booking.bookingStatus || 'pending',
        idNumber: booking.idNumber || '',
        idPhoto: booking.idPhoto || '',
        invoiceUrl: booking.invoiceUrl || '',
        createdAt: booking.createdAt || booking.created_at || '',
        notes: booking.notes || booking.remarks || '',
        familyMembers: booking.familyMembers || booking.guests || [],
        userId: booking.user?._id || booking.user?.id || ''
      }));

      setBookings(normalizedBookings);

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
        const hasMorePages = bookingsArray.length === filters.limit;
        const estimatedTotal = hasMorePages
          ? filters.page * filters.limit + 1
          : (filters.page - 1) * filters.limit + bookingsArray.length;
        const estimatedPages = hasMorePages ? filters.page + 1 : filters.page;

        setPagination({
          currentPage: filters.page,
          totalPages: estimatedPages,
          totalItems: estimatedTotal
        });
      }
      setError('');
    } catch (error) {
      console.error('Bookings fetch error:', error);
      setError('Failed to load bookings. Please try again.');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value, page: 1 };
      localStorage.setItem('bookingManagementFilters', JSON.stringify(newFilters));
      return newFilters;
    });
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleViewBooking = async (booking) => {
    setViewModalOpen(true);
    setViewLoading(true);
    setViewError('');
    setSelectedBooking(null);
    try {
      const response = await bookingService.getById(booking.id);
      setSelectedBooking(response?.data?.data || response?.data || response);
    } catch (err) {
      setViewError(err?.response?.data?.message || err?.message || 'Failed to fetch details');
    } finally {
      setViewLoading(false);
    }
  };

  const handleViewDocuments = async (booking) => {
    setShowDocumentModal(true);
    setDocumentLoading(true);
    setDocumentError('');
    setSelectedUserDocs(null);
    try {
      if (!booking.userId) {
        throw new Error("User ID is missing for this booking.");
      }
      const response = await bookingService.getUserDocuments(booking.userId);
      setSelectedUserDocs(response?.data?.data || response?.data || response);
    } catch (err) {
      setDocumentError(err?.response?.data?.message || err?.message || 'Failed to fetch documents');
    } finally {
      setDocumentLoading(false);
    }
  };

  return {
    bookings,
    loading,
    error,
    filters,
    pagination,
    handleFilterChange,
    handlePageChange,
    handleViewBooking,
    viewModalOpen,
    setViewModalOpen,
    selectedBooking,
    setSelectedBooking,
    viewLoading,
    viewError,
    setViewError,
    showBookingModal,
    setShowBookingModal,
    editingBooking,
    setEditingBooking,
    showGuestDetailsModal,
    setShowGuestDetailsModal,
    selectedGuest,
    setSelectedGuest,
    showDocumentModal,
    setShowDocumentModal,
    selectedUserDocs,
    documentLoading,
    documentError,
    handleViewDocuments,
    refreshBookings: fetchBookings
  };
};
