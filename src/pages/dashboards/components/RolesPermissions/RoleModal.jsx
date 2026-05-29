import React, { useState, useEffect } from 'react';
import { roleService } from '@/services/roleService';

const RoleModal = ({ isOpen, onClose, onRoleSaved, editingRole }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    permissions: {
      view: true,
      create: false,
      edit: false,
      delete: false,
    },
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingRole) {
      // Handle legacy array format or missing permissions
      let perms = editingRole.permissions;
      if (Array.isArray(perms) || !perms || typeof perms !== 'object') {
        perms = {
          view: true,
          create: false,
          edit: false,
          delete: false,
        };
      }
      
      setForm({
        name: editingRole.name || '',
        description: editingRole.description || '',
        permissions: perms,
      });
    } else {
      setForm({
        name: '',
        description: '',
        permissions: {
          view: true,
          create: false,
          edit: false,
          delete: false,
        },
      });
    }
  }, [editingRole, isOpen]);

  if (!isOpen) return null;

  const handlePermissionChange = (key) => {
    setForm((prev) => {
      const newPermissions = { ...prev.permissions, [key]: !prev.permissions[key] };
      
      // Validation: Cannot allow Create/Edit/Delete if View is false
      // If we enable any action, view must be true
      if (key !== 'view' && newPermissions[key]) {
        newPermissions.view = true;
      }
      
      // If we disable view, all other actions must be disabled
      if (key === 'view' && !newPermissions.view) {
        newPermissions.create = false;
        newPermissions.edit = false;
        newPermissions.delete = false;
      }

      return { ...prev, permissions: newPermissions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Role name is required');

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
        className="bg-white rounded-3xl p-10 max-w-lg w-full mx-4 my-8 shadow-2xl flex flex-col border border-white/20 backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-3xl font-black text-gray-800 mb-8 flex-shrink-0 tracking-tight">
          {editingRole ? 'Edit Role' : 'Add Role'}
        </h3>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-bold text-gray-700"
                placeholder="e.g. Manager"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-medium text-gray-600"
                rows="3"
                placeholder="Briefly describe the role responsibilities..."
              />
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-6 ml-1">
                Global Permissions
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(form.permissions).map((key) => (
                  <label
                    key={key}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                      form.permissions[key] 
                        ? 'bg-orange-50 border-orange-500' 
                        : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={`text-sm font-black uppercase tracking-tight transition-colors ${
                        form.permissions[key] ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {key}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {key === 'view' ? 'Access everything' : `Can ${key} data`}
                      </span>
                    </div>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.permissions[key]}
                        onChange={() => handlePermissionChange(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
          </div>
          
          <div className="flex gap-4 mt-12 flex-shrink-0">
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black transition-all shadow-lg shadow-orange-500/30 active:scale-95 disabled:opacity-50 text-lg tracking-tight"
            >
              {loading ? 'Saving...' : editingRole ? 'Update Role' : 'Create Role'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-500 py-5 rounded-2xl font-black transition-all active:scale-95 text-lg tracking-tight"
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
