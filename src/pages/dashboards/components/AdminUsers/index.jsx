import React, { useState } from 'react';
import UserFilterBar from './UserFilterBar';
import UserTable from './UserTable';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import { useAdminUsers } from './useAdminUsers';
import { useAuth } from '@/context/AuthContext';
import { EditIcon, DeleteIcon } from '@/components/icons';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

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
    handleDeleteUser,
    fetchUsers,
    users
  } = useAdminUsers();

  const { canAccess } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, userId: null });

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

  const canCreate = canAccess('adminUsers', 'create');
  const canEdit = canAccess('adminUsers', 'edit');
  const canDelete = canAccess('adminUsers', 'delete');

  if (canEdit || canDelete) {
    columns.push({
      key: 'action',
      header: 'Actions',
      accessor: (r) => r,
      render: (_, r) => (
        <div className="flex items-center space-x-3">
          {canEdit && (
            <button
              onClick={() => {
                setEditingUser(r);
                setShowEditModal(true);
                fetchActiveRoles();
              }}
              className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <EditIcon className="w-5 h-5" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setDeleteConfirm({ isOpen: true, userId: r._id || r.id })}
              className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <DeleteIcon className="w-5 h-5" />
            </button>
          )}
        </div>
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
          {canCreate && (
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
          )}
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
      />

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Admin User?"
        message="Are you sure you want to delete this admin user? This action cannot be undone and will permanently remove their access."
        confirmText="Yes, Delete User"
        onConfirm={async () => {
          await handleDeleteUser(deleteConfirm.userId);
          setDeleteConfirm({ isOpen: false, userId: null });
        }}
        onCancel={() => setDeleteConfirm({ isOpen: false, userId: null })}
        type="danger"
      />
    </>
  );
};

export default AdminUsers;
