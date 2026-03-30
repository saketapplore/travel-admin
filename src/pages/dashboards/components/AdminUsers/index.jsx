import React, { useState } from 'react';
import UserFilterBar from './UserFilterBar';
import UserTable from './UserTable';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import { useAdminUsers } from './useAdminUsers';

const AdminUsers = () => {
  const {
    loading,
    error,
    roles,
    activeRoles,
    activeRolesLoading,
    fetchActiveRoles,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    currentUsers,
    filteredUsers,
    itemsPerPage,
    handleEnableUser,
    handleDisableUser,
    fetchUsers,
    authUser,
    users
  } = useAdminUsers();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const columns = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      render: (v) => v || 'N/A',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    { key: 'email', header: 'Email', accessor: 'email', cellClassName: 'text-sm text-gray-500' },
    {
      key: 'role',
      header: 'Role',
      accessor: (r) => r,
      render: (_, r) => {
        const role = r.role || r.roleName;
        if (!role) return 'N/A';
        return typeof role === 'object' ? role.name || role.roleName : role;
      },
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (r) => r,
      render: (_, r) => (
        <div className="flex items-center space-x-3">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {r.isActive ? 'Active' : 'Disabled'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={r.isActive}
              onChange={(e) =>
                e.target.checked
                  ? handleEnableUser(r._id || r.id)
                  : handleDisableUser(r._id || r.id)
              }
              className="sr-only peer"
            />
            <div
              className={`relative w-11 h-6 rounded-full transition-colors ${r.isActive ? 'bg-orange-500' : 'bg-gray-200'} peer-focus:ring-4 peer-focus:ring-orange-300`}
            >
              <div
                className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${r.isActive ? 'translate-x-full' : 'translate-x-0'}`}
              ></div>
            </div>
          </label>
        </div>
      )
    }
  ];

  if (authUser?.roleKey === 'super-admin') {
    columns.push({
      key: 'action',
      header: 'Action',
      accessor: (r) => r,
      render: (_, r) => (
        <button
          onClick={() => {
            setEditingUser(r);
            setShowEditModal(true);
            fetchActiveRoles();
          }}
          className="text-orange-600 hover:text-orange-900 font-medium"
        >
          Edit
        </button>
      ),
      cellClassName: 'text-sm font-medium'
    });
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Admin Users</h3>
            <p className="text-sm text-gray-600">Manage admin users and their activation status</p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(true);
              fetchActiveRoles();
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-md active:scale-95 flex items-center space-x-2"
          >
            <span className="text-xl">+</span>
            <span>Create Admin</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <UserFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roles={roles}
        />

        <UserTable
          users={currentUsers}
          filteredCount={filteredUsers.length}
          totalCount={users.length}
          loading={loading}
          columns={columns}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />
      </div>

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={fetchUsers}
        activeRoles={activeRoles}
        activeRolesLoading={activeRolesLoading}
      />

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        onUserUpdated={fetchUsers}
        user={editingUser}
        activeRoles={activeRoles}
        activeRolesLoading={activeRolesLoading}
        authUser={authUser}
      />
    </>
  );
};

export default AdminUsers;
