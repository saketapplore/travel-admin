import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertyContext';

const PropertyManagerDashboard = () => {
  const { user } = useAuth();
  const { properties: allProperties, getPropertiesByManager } = useProperties();
  
  // Get only properties assigned to this property manager
  const properties = useMemo(() => {
    if (!user?.email) return [];
    return getPropertiesByManager(user.email);
  }, [user?.email, getPropertiesByManager]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handleViewProperty = (property) => {
    setSelectedProperty({
      ...property,
      media: property.media || '',
      availability: property.availability || '',
      uploadedFiles: property.uploadedFiles || []
    });
    setShowModal(true);
  };

  // Helper function to parse media and extract image URLs
  const getImageUrls = (property) => {
    const images = [];
    
    // Check if uploadedFiles array exists
    if (property.uploadedFiles && Array.isArray(property.uploadedFiles)) {
      property.uploadedFiles.forEach(file => {
        if (file.url && (file.type?.startsWith('image/') || file.url.startsWith('data:image'))) {
          images.push(file.url);
        }
      });
    }
    
    // Also check media field for comma-separated URLs or base64 strings
    if (property.media) {
      const mediaItems = property.media.split(',').map(item => item.trim()).filter(Boolean);
      mediaItems.forEach(item => {
        // Check if it's a base64 image or a URL
        if (item.startsWith('data:image') || item.startsWith('http://') || item.startsWith('https://')) {
          images.push(item);
        }
      });
    }
    
    return images;
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
                {properties.reduce((sum, p) => sum + Number(p.rooms || 0), 0)}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold mb-6 flex-shrink-0">{selectedProperty.name}</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Location:</p>
                  <p className="text-gray-600">{selectedProperty.location}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Rooms:</p>
                  <p className="text-gray-600">{selectedProperty.rooms}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Price:</p>
                  <p className="text-gray-600">{selectedProperty.price}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Status:</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedProperty.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedProperty.status}
                  </span>
                </div>
              </div>
              
              {selectedProperty.description && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Description:</p>
                  <p className="text-gray-600">{selectedProperty.description}</p>
                </div>
              )}
              
              {selectedProperty.amenities && (
                <div>
                  <p className="font-semibold text-gray-700 mb-1">Amenities:</p>
                  <p className="text-gray-600">{selectedProperty.amenities}</p>
                </div>
              )}

              {/* Images Gallery */}
              {(() => {
                const imageUrls = getImageUrls(selectedProperty);
                if (imageUrls.length > 0) {
                  return (
                    <div>
                      <p className="font-semibold text-gray-700 mb-3">Media ({imageUrls.length}):</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                            <div className="hidden w-full h-48 bg-gray-100 rounded-lg border border-gray-200 items-center justify-center">
                              <p className="text-gray-400 text-sm">Failed to load image</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Documents List */}
              {selectedProperty.uploadedFiles && Array.isArray(selectedProperty.uploadedFiles) && (
                (() => {
                  const documents = selectedProperty.uploadedFiles.filter(
                    file => !file.type?.startsWith('image/') && !file.url?.startsWith('data:image')
                  );
                  if (documents.length > 0) {
                    return (
                      <div>
                        <p className="font-semibold text-gray-700 mb-2">Documents ({documents.length}):</p>
                        <div className="space-y-2">
                          {documents.map((doc, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                  {doc.size ? `${(doc.size / 1024).toFixed(2)} KB` : 'Document'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()
              )}

              {/* Availability Calendar Summary */}
              {selectedProperty.selectedDates && Array.isArray(selectedProperty.selectedDates) && selectedProperty.selectedDates.length > 0 && (
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Availability:</p>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-gray-600">
                          Booked: {selectedProperty.selectedDates.filter(d => d.status === 'booked').length} dates
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-gray-600">
                          Available: {selectedProperty.selectedDates.filter(d => d.status === 'available').length} dates
                        </span>
                      </div>
                    </div>
                  </div>
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

export default PropertyManagerDashboard;

