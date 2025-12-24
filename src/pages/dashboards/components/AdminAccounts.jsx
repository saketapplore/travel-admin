import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import CustomTable from '../../../components/CustomTable';
import { EditIcon, EnableIcon, DisableIcon } from '../../../components/icons';

const AdminAccounts = () => {
  const { userAccounts, createAccount, updateAccount, deleteAccount } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleKey: 'property-manager',
    status: 'Active'
  });
  const [formError, setFormError] = useState('');

  const handleCreateAdmin = () => {
    setEditingAdmin(null);
    setFormData({ name: '', email: '', password: '', roleKey: 'property-manager', status: 'Active' });
    setFormError('');
    setShowModal(true);
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setFormData({ 
      name: admin.name, 
      email: admin.email, 
      password: admin.password,
      roleKey: admin.roleKey, 
      status: admin.status 
    });
    setFormError('');
    setShowModal(true);
  };

  const handleEnableAdmin = (admin) => {
    const result = updateAccount(admin.id, { ...admin, status: 'Active' });
    if (!result.success) {
      setFormError(result.message || 'Failed to enable account');
    }
  };

  const handleDisableAdmin = (admin) => {
    if (window.confirm('Are you sure you want to disable this account?')) {
      const result = updateAccount(admin.id, { ...admin, status: 'Inactive' });
      if (!result.success) {
        setFormError(result.message || 'Failed to disable account');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.password || formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    if (editingAdmin) {
      const result = updateAccount(editingAdmin.id, formData);
      if (result.success) {
        setShowModal(false);
      } else {
        setFormError(result.message);
      }
    } else {
      const result = createAccount(formData);
      if (result.success) {
        setShowModal(false);
      } else {
        setFormError(result.message);
      }
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
      key: 'email',
      header: 'Email',
      accessor: 'email',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'role',
      header: 'Role',
      accessor: 'role',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
      render: (_, row) => {
        const isActive = row.status === 'Active';
        return (
          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEditAdmin(row);
              }}
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <EditIcon className="w-5 h-5" />
            </button>
            {isActive ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDisableAdmin(row);
                }}
                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                title="Disable"
              >
                <DisableIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEnableAdmin(row);
                }}
                className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                title="Enable"
              >
                <EnableIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Admin Accounts</h3>
          <button
            onClick={handleCreateAdmin}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
          >
            + Create New Account
          </button>
        </div>

        <CustomTable
          columns={columns}
          data={userAccounts}
          emptyMessage="No accounts created yet. Click 'Create New Account' to add one."
        />
      </div>

      {/* Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">
              {editingAdmin ? 'Edit Account' : 'Create New Account'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={editingAdmin}
                    required
                  />
                  {editingAdmin && (
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={editingAdmin ? "Enter new password to change" : "Enter password"}
                    required={!editingAdmin}
                    minLength="6"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={formData.roleKey}
                    onChange={(e) => setFormData({ ...formData, roleKey: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="property-manager">Property Manager</option>
                    <option value="booking-manager">Booking Manager</option>
                    <option value="staff-manager">Staff Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {formError}
                </div>
              )}

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingAdmin ? 'Update' : 'Create Account'}
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
    </>
  );
};

export default AdminAccounts;



