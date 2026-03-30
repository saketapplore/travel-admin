import React, { useState, useEffect } from 'react';

const BookingFormModal = ({ isOpen, onClose, onSubmit, booking }) => {
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (booking) {
      setFormData({
        guestName: booking.guestName || '',
        guestEmail: booking.guestEmail || '',
        guestPhone: booking.guestPhone || '',
        propertyName: booking.propertyName || '',
        checkIn: booking.checkIn || '',
        checkOut: booking.checkOut || '',
        guests: booking.guests || '',
        amount: booking.amount || '',
        paymentStatus: booking.paymentStatus || 'pending',
        bookingStatus: booking.bookingStatus || 'pending',
        idNumber: booking.idNumber || '',
        notes: booking.notes || ''
      });
    }
  }, [booking]);

  if (!isOpen) return null;

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
          Booking Details - {formData.guestName}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="flex-1 overflow-y-auto pr-2"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Guest Information
              </h4>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.guestName}
                onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guest Phone</label>
              <input
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID Number</label>
              <input
                type="text"
                value={formData.idNumber}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            {booking?.idPhoto && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">ID Photo</label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 text-center">
                  <img
                    src={booking.idPhoto}
                    alt="ID Photo"
                    className="max-w-md mx-auto rounded-lg border border-gray-200"
                  />
                </div>
              </div>
            )}

            <div className="col-span-2 mt-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Booking Details
              </h4>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
              <input
                type="text"
                value={formData.propertyName}
                onChange={(e) => setFormData({ ...formData, propertyName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <input
                type="number"
                min="1"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check In Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.checkIn}
                onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check Out Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.checkOut}
                onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
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
                value={formData.bookingStatus}
                onChange={(e) => setFormData({ ...formData, bookingStatus: e.target.value })}
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
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="3"
                placeholder="Additional notes about this booking..."
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-6 flex-shrink-0 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-md active:scale-95"
            >
              Update Booking
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

export default BookingFormModal;
