import React, { useState } from 'react';
import CustomTable from '../../components/CustomTable';
import { EditIcon, DeleteIcon } from '../../components/icons';

const StaffManagerDashboard = () => {
  const [staff, setStaff] = useState([
    { id: 1, name: 'Emma Thompson', role: 'Housekeeping', property: 'Sunset Villa', status: 'Active', contact: '+1234567890' },
    { id: 2, name: 'James Wilson', role: 'Receptionist', property: 'Ocean View Resort', status: 'Active', contact: '+1234567891' },
    { id: 3, name: 'Sarah Johnson', role: 'Chef', property: 'Mountain Retreat', status: 'On Leave', contact: '+1234567892' },
    { id: 4, name: 'Michael Brown', role: 'Security', property: 'Sunset Villa', status: 'Active', contact: '+1234567893' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Housekeeping',
    property: 'Sunset Villa',
    status: 'Active',
    contact: ''
  });

  const handleAddStaff = () => {
    setEditingStaff(null);
    setFormData({ name: '', role: 'Housekeeping', property: 'Sunset Villa', status: 'Active', contact: '' });
    setShowModal(true);
  };

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData(staffMember);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      setStaff(staff.map(s => 
        s.id === editingStaff.id ? { ...formData, id: s.id } : s
      ));
    } else {
      setStaff([...staff, { ...formData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'role',
      header: 'Role',
      accessor: 'role',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'property',
      header: 'Property',
      accessor: 'property',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'contact',
      header: 'Contact',
      accessor: 'contact',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
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
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditStaff(row);
            }}
            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteStaff(row.id);
            }}
            className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove"
          >
            <DeleteIcon className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Staff Manager Dashboard</h2>
        <p className="text-gray-600">Onboard staff members, assign bookings, and manage staff roles</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Staff</p>
              <p className="text-3xl font-bold text-gray-800">{staff.length}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active</p>
              <p className="text-3xl font-bold text-green-600">
                {staff.filter(s => s.status === 'Active').length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">On Leave</p>
              <p className="text-3xl font-bold text-yellow-600">
                {staff.filter(s => s.status === 'On Leave').length}
              </p>
            </div>
            <div className="text-4xl">🏖️</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Departments</p>
              <p className="text-3xl font-bold text-blue-600">4</p>
            </div>
            <div className="text-4xl">🏢</div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Staff Members</h3>
          <button
            onClick={handleAddStaff}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            + Onboard New Staff
          </button>
        </div>

        <CustomTable
          columns={columns}
          data={staff}
          emptyMessage="No staff members added yet. Click 'Onboard New Staff' to add one."
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">
              {editingStaff ? 'Edit Staff Member' : 'Onboard New Staff'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option>Housekeeping</option>
                    <option>Receptionist</option>
                    <option>Chef</option>
                    <option>Security</option>
                    <option>Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
                  <select
                    value={formData.property}
                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option>Sunset Villa</option>
                    <option>Ocean View Resort</option>
                    <option>Mountain Retreat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                  <input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option>Active</option>
                    <option>On Leave</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingStaff ? 'Update' : 'Add Staff'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagerDashboard;


