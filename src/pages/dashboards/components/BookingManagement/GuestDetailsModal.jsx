import React from 'react';

const GuestDetailsModal = ({ isOpen, onClose, guest }) => {
  if (!isOpen || !guest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h3 className="text-2xl font-bold text-gray-800">Guest Details - {guest.guestName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Primary Guest Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {guest.guestName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {guest.guestEmail}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {guest.guestPhone}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {guest.idNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Booking Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {guest.propertyName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Guests</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {guest.guests}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {guest.checkIn}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {guest.checkOut}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Family Members ({guest.familyMembers?.length || 0})
            </h4>
            {guest.familyMembers && guest.familyMembers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Relation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {guest.familyMembers.map((member, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {member.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {member.phone}
                        </td>
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
              <p className="text-sm text-gray-500 text-center py-4">
                No family members registered for this booking.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 flex-shrink-0 pt-4 border-t">
          <button
            onClick={onClose}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-2xl font-bold transition-all duration-300 shadow-md active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestDetailsModal;
