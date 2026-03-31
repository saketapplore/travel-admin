import React from 'react';
import BookingFilterBar from './BookingFilterBar';
import BookingTable from './BookingTable';
import BookingFormModal from './BookingFormModal';
import GuestDetailsModal from './GuestDetailsModal';
import BookingViewModal from './BookingViewModal';
import DocumentViewModal from './DocumentViewModal';
import { useBookings } from './useBookings';
import { generateBookingInvoice } from '@/utils/invoiceGenerator';
import { bookingService } from '@/services/bookingService';

const BookingManagement = () => {
  const {
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
    viewLoading,
    viewError,
    showBookingModal,
    setShowBookingModal,
    editingBooking,
    setEditingBooking,
    showGuestDetailsModal,
    setShowGuestDetailsModal,
    selectedGuest,
    showDocumentModal,
    setShowDocumentModal,
    selectedUserDocs,
    documentLoading,
    documentError,
    handleViewDocuments,
    refreshBookings
  } = useBookings();

  const handleBookingSubmit = async (formData) => {
    try {
      await bookingService.update(editingBooking.id, formData);
      await refreshBookings();
      setShowBookingModal(false);
      setEditingBooking(null);
    } catch (error) {
      console.error('Update booking error:', error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Management</h3>
        </div>

        <BookingFilterBar filters={filters} onFilterChange={handleFilterChange} />

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <BookingTable
          bookings={bookings}
          loading={loading}
          filters={filters}
          pagination={pagination}
          onPageChange={handlePageChange}
          onViewBooking={handleViewBooking}
          onGenerateInvoice={generateBookingInvoice}
          onViewDocuments={handleViewDocuments}
          onSearch={(searchTerm) => handleFilterChange('search', searchTerm)}
        />
      </div>

      <BookingFormModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSubmit={handleBookingSubmit}
        booking={editingBooking}
      />

      <GuestDetailsModal
        isOpen={showGuestDetailsModal}
        onClose={() => setShowGuestDetailsModal(false)}
        guest={selectedGuest}
      />

      <BookingViewModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        booking={selectedBooking}
        loading={viewLoading}
        error={viewError}
      />

      <DocumentViewModal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        documents={selectedUserDocs}
        loading={documentLoading}
        error={documentError}
      />
    </>
  );
};

export default BookingManagement;
