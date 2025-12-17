import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const RolesPermissions = () => {
  const [rolesSubSection, setRolesSubSection] = useState('roles');
  
  // Permissions (API) State
  const [permissionsData, setPermissionsData] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsError, setPermissionsError] = useState('');
  const [permissionPage, setPermissionPage] = useState(1);
  const PERMISSION_PAGE_SIZE = 10;

  // Helper to render permission label safely
  const permissionLabel = (perm) =>
    perm?.name ||
    perm?.permissionName ||
    perm?.displayName ||
    perm?.title ||
    perm?.code ||
    perm?.slug ||
    perm?._id ||
    perm?.id ||
    (typeof perm === 'string' ? perm : JSON.stringify(perm));

  // Local editable tables for roles and permissions (UI only)
  const [rolesTable, setRolesTable] = useState([
    { id: 'role-1', name: 'Property Manager', description: 'Manages properties and listings' },
    { id: 'role-2', name: 'Booking Manager', description: 'Handles bookings and reservations' },
    { id: 'role-3', name: 'Staff Manager', description: 'Manages staff and assignments' },
    { id: 'role-4', name: 'Super Admin', description: 'Full system access' },
  ]);
  const [permissionsTable, setPermissionsTable] = useState([
    { id: 'perm-1', name: 'Manage Properties', description: 'Create, edit, and delete properties' },
    { id: 'perm-2', name: 'Manage Bookings', description: 'Handle booking lifecycle and payments' },
    { id: 'perm-3', name: 'Manage Staff', description: 'Onboard and manage staff assignments' },
    { id: 'perm-4', name: 'Create Accounts', description: 'Create new admin/staff accounts' },
    { id: 'perm-5', name: 'View Reports', description: 'Access analytics and reporting' },
  ]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ name: '', description: '' });

  // Fetch permissions when Permissions tab is active
  useEffect(() => {
    const fetchPermissions = async () => {
      if (rolesSubSection !== 'permissions') return;
      setPermissionsLoading(true);
      setPermissionsError('');
      try {
        const response = await api.get('/permission');
        const data = response?.data?.data || response?.data || [];
        setPermissionsData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Permissions fetch error:', error);
        if (error?.status === 401) {
          setPermissionsError('Authentication required. Please try refreshing the page.');
        } else {
          setPermissionsError(error?.message || 'Failed to load permissions. Using default permissions.');
        }
        setPermissionsData([]);
      } finally {
        setPermissionsLoading(false);
      }
    };

    fetchPermissions();
  }, [rolesSubSection]);

  // When API permissions arrive, mirror them into local editable table (UI only)
  useEffect(() => {
    if (permissionsData && permissionsData.length > 0) {
      const mapped = permissionsData.map((perm, idx) => ({
        id: perm?._id || perm?.id || `api-perm-${idx}`,
        name: permissionLabel(perm),
        description:
          perm?.description ||
          perm?.details ||
          perm?.note ||
          'API permission',
      }));
      setPermissionsTable(mapped);
      setPermissionPage(1);
    }
  }, [permissionsData]);

  // Role table handlers (UI only)
  const handleAddRole = () => {
    setEditingRole(null);
    setRoleForm({ name: '', description: '' });
    setShowRoleModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setRoleForm({ name: role.name, description: role.description });
    setShowRoleModal(true);
  };

  const handleDeleteRole = (id) => {
    setRolesTable((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    if (!roleForm.name.trim()) return;
    if (editingRole) {
      setRolesTable((prev) =>
        prev.map((r) => (r.id === editingRole.id ? { ...r, ...roleForm } : r))
      );
    } else {
      setRolesTable((prev) => [
        ...prev,
        { id: `role-${Date.now()}`, ...roleForm },
      ]);
    }
    setShowRoleModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Roles & Permissions</h3>
          
          {/* Toggle Buttons */}
          <div className="flex space-x-3 mb-4">
            <button
              onClick={() => setRolesSubSection('roles')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                rolesSubSection === 'roles'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👤 Roles
            </button>
            <button
              onClick={() => setRolesSubSection('permissions')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                rolesSubSection === 'permissions'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔐 Permissions
            </button>
          </div>

          <p className="text-sm text-gray-600">
            {rolesSubSection === 'roles' 
              ? 'Overview of all user roles and their capabilities in the system'
              : 'Detailed view of permissions across all roles'}
          </p>
        </div>

        {/* Roles Content */}
        {rolesSubSection === 'roles' && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h4 className="font-semibold text-gray-800">Roles List</h4>
            <button
              onClick={handleAddRole}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200"
            >
              + Add Role
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rolesTable.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{role.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{role.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleEditRole(role)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {rolesTable.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-6 text-center text-sm text-gray-500">No roles available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Permissions Content */}
        {rolesSubSection === 'permissions' && (
        <>
        {/* API-backed permission list */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-800">API Permissions</h4>
              <p className="text-sm text-gray-600">Live permissions from travel-rumours API</p>
            </div>
            {permissionsLoading && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
          </div>
          {permissionsError && (
            <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
              {permissionsError}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b">
            <h4 className="font-semibold text-gray-800">Permissions List</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissionsTable
                  .slice((permissionPage - 1) * PERMISSION_PAGE_SIZE, permissionPage * PERMISSION_PAGE_SIZE)
                  .map((perm) => (
                  <tr key={perm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{perm.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{perm.description}</td>
                  </tr>
                ))}
                {permissionsTable.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-6 py-6 text-center text-sm text-gray-500">No permissions available.</td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination */}
            {permissionsTable.length > PERMISSION_PAGE_SIZE && (
              <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-700">
                <span>
                  Showing {(permissionPage - 1) * PERMISSION_PAGE_SIZE + 1}-
                  {Math.min(permissionPage * PERMISSION_PAGE_SIZE, permissionsTable.length)} of {permissionsTable.length}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setPermissionPage((p) => Math.max(1, p - 1))}
                    disabled={permissionPage === 1}
                    className={`px-3 py-1 rounded border ${
                      permissionPage === 1
                        ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setPermissionPage((p) =>
                        p * PERMISSION_PAGE_SIZE < permissionsTable.length ? p + 1 : p
                      )
                    }
                    disabled={permissionPage * PERMISSION_PAGE_SIZE >= permissionsTable.length}
                    className={`px-3 py-1 rounded border ${
                      permissionPage * PERMISSION_PAGE_SIZE >= permissionsTable.length
                        ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>

      {/* Role Modal (UI only) */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-6">
              {editingRole ? 'Edit Role' : 'Add Role'}
            </h3>
            <form onSubmit={handleRoleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingRole ? 'Update' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
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

export default RolesPermissions;

