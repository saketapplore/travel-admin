import React, { useState } from 'react';

const BookingManagerDashboard = () => {
  const [bookings, setBookings] = useState([
    { id: 1, guest: 'Alice Cooper', property: 'Sunset Villa', checkIn: '2024-01-15', checkOut: '2024-01-20', status: 'Confirmed', amount: '$1000' },
    { id: 2, guest: 'Bob Wilson', property: 'Ocean View Resort', checkIn: '2024-01-18', checkOut: '2024-01-25', status: 'Pending', amount: '$2450' },
    { id: 3, guest: 'Carol Davis', property: 'Mountain Retreat', checkIn: '2024-01-20', checkOut: '2024-01-27', status: 'Confirmed', amount: '$1960' },
    { id: 4, guest: 'David Brown', property: 'Sunset Villa', checkIn: '2024-01-22', checkOut: '2024-01-24', status: 'Cancelled', amount: '$400' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleUpdateStatus = (bookingId, newStatus) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Manager Dashboard</h2>
        <p className="text-gray-600">View and manage booking requests, confirmations, cancellations, and payments</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-800">{bookings.length}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Confirmed</p>
              <p className="text-3xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'Confirmed').length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'Pending').length}
              </p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue</p>
              <p className="text-3xl font-bold text-blue-600">$5.8K</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">All Bookings</h3>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.guest}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.property}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewBooking(booking)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    {booking.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'Confirmed')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Confirm
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">Booking Details</h3>
            <div className="space-y-3">
              <p><span className="font-semibold">Guest:</span> {selectedBooking.guest}</p>
              <p><span className="font-semibold">Property:</span> {selectedBooking.property}</p>
              <p><span className="font-semibold">Check In:</span> {selectedBooking.checkIn}</p>
              <p><span className="font-semibold">Check Out:</span> {selectedBooking.checkOut}</p>
              <p><span className="font-semibold">Amount:</span> {selectedBooking.amount}</p>
              <p><span className="font-semibold">Status:</span> {selectedBooking.status}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagerDashboard;

