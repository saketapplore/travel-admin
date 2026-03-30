import React, { useState, useEffect } from 'react';
import { roleService } from '@/services/roleService';

const RoleModal = ({ isOpen, onClose, onRoleSaved, editingRole, availablePermissions }) => {
  const [form, setForm] = useState({ name: '', description: '', permissions: [] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (editingRole) {
      const perms = (editingRole.permissions || editingRole.permissionIds || []).map((p) =>
        typeof p === 'string' ? p : p._id || p.id
      );
      setForm({
        name: editingRole.name || editingRole.roleName || '',
        description: editingRole.description || '',
        permissions: perms
      });
    } else {
      setForm({ name: '', description: '', permissions: [] });
    }
    setSearchTerm('');
  }, [editingRole, isOpen]);

  if (!isOpen) return null;

  const handleTogglePermission = (id) => {
    setForm((prev) => {
      const isSelected = prev.permissions.includes(id);
      return {
        ...prev,
        permissions: isSelected
          ? prev.permissions.filter((p) => p !== id)
          : [...prev.permissions, id]
      };
    });
  };

  const handleToggleAll = () => {
    setForm((prev) => {
      const allIds = availablePermissions.map((p) => p._id || p.id);
      const isAllSelected = prev.permissions.length === allIds.length;
      return {
        ...prev,
        permissions: isAllSelected ? [] : allIds
      };
    });
  };

  const filteredPermissions = availablePermissions.filter((perm) => {
    const label = (
      perm.name ||
      perm.permissionName ||
      perm.displayName ||
      perm.title ||
      ''
    ).toLowerCase();
    return label.includes(searchTerm.toLowerCase());
  });

  const getPermissionLabel = (perm) =>
    perm.name || perm.permissionName || perm.displayName || perm.title || 'N/A';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Role name is required');
    if (form.permissions.length === 0) return setError('At least one permission is required');

    setLoading(true);
    try {
      if (editingRole) {
        await roleService.update(editingRole._id || editingRole.id, form);
      } else {
        await roleService.create(form);
      }
      onRoleSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold mb-6 flex-shrink-0">
          {editingRole ? 'Edit Role' : 'Add Role'}
        </h3>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 transition-all"
                rows="3"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Permissions <span className="text-red-500">*</span>
                </label>
                <div className="relative w-48">
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                  <svg
                    className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="border border-gray-300 rounded-xl overflow-hidden flex flex-col h-72 shadow-sm bg-gray-50/30">
                <div className="bg-gray-100/80 px-4 py-2.5 border-b flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    PERMISSION
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleAll}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    {form.permissions.length === availablePermissions.length
                      ? 'Deselect All'
                      : 'Select All'}
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white">
                  {filteredPermissions.length > 0 ? (
                    filteredPermissions.map((perm) => (
                      <label
                        key={perm._id || perm.id}
                        className="flex items-center space-x-3 p-3 hover:bg-orange-50/50 cursor-pointer transition-colors group"
                      >
                        <input
                          type="checkbox"
                          checked={form.permissions.includes(perm._id || perm.id)}
                          onChange={() => handleTogglePermission(perm._id || perm.id)}
                          className="w-4.5 h-4.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 transition-all cursor-pointer"
                        />
                        <span className="text-sm font-bold text-gray-900 group-hover:text-orange-700 transition-colors">
                          {getPermissionLabel(perm)}
                        </span>
                      </label>
                    ))
                  ) : (
                    <div className="p-8 text-center text-sm text-gray-500 italic">
                      No permissions match your search.
                    </div>
                  )}
                </div>
                <div className="bg-gray-50 px-4 py-2 border-t text-[10px] font-medium text-gray-400">
                  {form.permissions.length} of {availablePermissions.length} selected
                </div>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}
          </div>
          <div className="flex space-x-3 mt-6 flex-shrink-0">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-2xl font-bold transition-all shadow-md active:scale-95"
            >
              {loading ? 'Saving...' : editingRole ? 'Update Role' : 'Create Role'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-2xl font-bold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
