import React, { useState } from 'react';
import { Users } from 'lucide-react';
import RoleList from './RoleList';
import RoleModal from './RoleModal';
import { useRolesPermissions } from './useRolesPermissions';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useAuth } from '../../../../context/AuthContext';

const RolesPermissions = () => {
  const { canAccess } = useAuth();
  const {
    rolesData,
    rolesLoading,
    rolesError,
    fetchRoles,
    handleEnableRole,
    handleDisableRole,
    handleDeleteRole
  } = useRolesPermissions();

  const canCreate = canAccess('rolesPermissions', 'create');
  const canEdit = canAccess('rolesPermissions', 'edit');
  const canDelete = canAccess('rolesPermissions', 'delete');

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, 
    type: 'danger', 
    title: '', 
    message: '', 
    onConfirm: () => {} 
  });

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
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">Roles & Permissions</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Overview of all user roles and their global capabilities
            </p>
          </div>
          {canCreate && (
            <button
              onClick={handleAddRole}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-black transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>Add New Role</span>
            </button>
          )}
        </div>

        {rolesError && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {rolesError}
          </div>
        )}

        <RoleList
          roles={rolesData}
          loading={rolesLoading}
          onEdit={handleEditRole}
          onEnable={handleEnableRole}
          onDisable={(id) => setConfirmDialog({
            isOpen: true,
            type: 'warning',
            title: 'Disable Role?',
            message: 'Are you sure you want to disable this role? Users with this role will lose their global permissions.',
            confirmText: 'Disable Role',
            onConfirm: () => {
              handleDisableRole(id);
              setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
          })}
          onDelete={(id) => setConfirmDialog({
            isOpen: true,
            type: 'danger',
            title: 'Delete Role?',
            message: 'Are you sure you want to delete this role? This action cannot be undone.',
            confirmText: 'Delete Role',
            onConfirm: () => {
              handleDeleteRole(id);
              setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
          })}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      </div>

      <RoleModal
        isOpen={showRoleModal}
        onClose={() => setShowRoleModal(false)}
        onRoleSaved={fetchRoles}
        editingRole={editingRole}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
        confirmText={confirmDialog.confirmText}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default RolesPermissions;
