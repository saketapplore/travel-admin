import React, { useState } from 'react';

const PropertyManagerDashboard = () => {
  const [properties, setProperties] = useState([
    { id: 1, name: 'Sunset Villa', location: 'Bali', rooms: 5, status: 'Available', price: '$200/night' },
    { id: 2, name: 'Ocean View Resort', location: 'Maldives', rooms: 10, status: 'Available', price: '$350/night' },
    { id: 3, name: 'Mountain Retreat', location: 'Switzerland', rooms: 8, status: 'Booked', price: '$280/night' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Property Manager Dashboard</h2>
        <p className="text-gray-600">Manage property details, availability, and bookings assigned to you</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Properties</p>
              <p className="text-3xl font-bold text-gray-800">{properties.length}</p>
            </div>
            <div className="text-4xl">🏢</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Available</p>
              <p className="text-3xl font-bold text-green-600">
                {properties.filter(p => p.status === 'Available').length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Booked</p>
              <p className="text-3xl font-bold text-orange-600">
                {properties.filter(p => p.status === 'Booked').length}
              </p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Rooms</p>
              <p className="text-3xl font-bold text-blue-600">
                {properties.reduce((sum, p) => sum + p.rooms, 0)}
              </p>
            </div>
            <div className="text-4xl">🛏️</div>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">My Properties</h3>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md">
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      property.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewProperty(property)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                    <button className="text-orange-600 hover:text-orange-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">{selectedProperty.name}</h3>
            <div className="space-y-3">
              <p><span className="font-semibold">Location:</span> {selectedProperty.location}</p>
              <p><span className="font-semibold">Rooms:</span> {selectedProperty.rooms}</p>
              <p><span className="font-semibold">Price:</span> {selectedProperty.price}</p>
              <p><span className="font-semibold">Status:</span> {selectedProperty.status}</p>
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

export default PropertyManagerDashboard;

