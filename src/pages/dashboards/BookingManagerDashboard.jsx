import React, { useState } from 'react';

const BookingManagerDashboard = () => {
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

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };


  const getBookingStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                {bookings.filter(b => b.bookingStatus === 'Approved').length}
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
                {bookings.filter(b => b.bookingStatus === 'Pending').length}
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
                      onClick={() => handleViewBooking(booking)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold mb-6 flex-shrink-0">Booking Details - {selectedBooking.guestName}</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Guest Name:</p>
                  <p className="text-gray-600">{selectedBooking.guestName}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Guest Email:</p>
                  <p className="text-gray-600">{selectedBooking.guestEmail}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Guest Phone:</p>
                  <p className="text-gray-600">{selectedBooking.guestPhone}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">ID Number:</p>
                  <p className="text-gray-600 font-mono">{selectedBooking.idNumber}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Property:</p>
                  <p className="text-gray-600">{selectedBooking.propertyName}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Guests:</p>
                  <p className="text-gray-600">{selectedBooking.guests}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Check In:</p>
                  <p className="text-gray-600">{selectedBooking.checkIn}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Check Out:</p>
                  <p className="text-gray-600">{selectedBooking.checkOut}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Amount:</p>
                  <p className="text-gray-600">${selectedBooking.amount}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Payment Status:</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Booking Status:</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBookingStatusColor(selectedBooking.bookingStatus)}`}>
                    {selectedBooking.bookingStatus}
                  </span>
                </div>
              </div>

              {/* ID Photo Display */}
              <div>
                <p className="font-semibold text-gray-700 mb-3">ID Photo:</p>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <img
                    src={selectedBooking.idPhoto}
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

              {selectedBooking.notes && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Notes:</p>
                  <p className="text-gray-600">{selectedBooking.notes}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200 flex-shrink-0"
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


