import React, { useState } from 'react';
import { Users, ShieldCheck } from 'lucide-react';
import RoleList from './RoleList';
import PermissionList from './PermissionList';
import RoleModal from './RoleModal';
import { useRolesPermissions } from './useRolesPermissions';

const RolesPermissions = () => {
  const {
    rolesSubSection,
    setRolesSubSection,
    rolesData,
    rolesLoading,
    rolesError,
    fetchRoles,
    permissionsData,
    permissionsLoading,
    permissionsError,
    permissionPage,
    setPermissionPage,
    PERMISSION_PAGE_SIZE,
    handleEnableRole,
    handleDisableRole,
    handleDeleteRole
  } = useRolesPermissions();


  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const handleAddRole = () => {
    setEditingRole(null);
    setShowRoleModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setShowRoleModal(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Roles & Permissions</h3>

          <div className="flex space-x-3 mb-6 bg-gray-50 p-1.5 rounded-2xl w-fit border border-gray-100">
            <button
              onClick={() => setRolesSubSection('roles')}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2.5 ${rolesSubSection === 'roles' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-white hover:text-orange-600'}`}
            >
              <Users className="w-5 h-5" />
              <span>Roles</span>
            </button>
            <button
              onClick={() => setRolesSubSection('permissions')}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2.5 ${rolesSubSection === 'permissions' ? 'bg-orange-500 text-white shadow-md' : 'text-gray-500 hover:bg-white hover:text-orange-600'}`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Permissions</span>
            </button>
          </div>

          <p className="text-sm text-gray-600">
            {rolesSubSection === 'roles'
              ? 'Overview of all user roles and their capabilities'
              : 'Detailed view of permissions across roles'}
          </p>
        </div>

        {rolesSubSection === 'roles' ? (
          <>
            {rolesError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                {rolesError}
              </div>
            )}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleAddRole}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-md active:scale-95"
              >
                + Add Role
              </button>
            </div>
            <RoleList
              roles={rolesData}
              loading={rolesLoading}
              onEdit={handleEditRole}
              onEnable={handleEnableRole}
              onDisable={handleDisableRole}
              onDelete={handleDeleteRole}
            />
          </>
        ) : (
          <PermissionList
            permissions={permissionsData}
            loading={permissionsLoading}
            error={permissionsError}
            page={permissionPage}
            pageSize={PERMISSION_PAGE_SIZE}
            onPageChange={setPermissionPage}
          />
        )}
      </div>

      <RoleModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleSaved={fetchRoles}
        editingRole={editingRole}
        availablePermissions={permissionsData}
      />
    </>
  );
};

export default RolesPermissions;
