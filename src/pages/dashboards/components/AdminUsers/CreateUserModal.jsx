import React, { useState } from 'react';
import { userService } from '@/services/userService';

const AVAILABLE_MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'stayManagement', label: 'Stay Management' },
  { id: 'adminUsers', label: 'Admin Users' },
  { id: 'rolesPermissions', label: 'Roles & Permissions' },
  { id: 'bookings', label: 'Booking Management' },
  { id: 'discounts', label: 'Discounts & Packages' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'financialSetting', label: 'Financial Setting' },
  { id: 'reporting', label: 'Reporting & Analytics' },
  { id: 'logs', label: 'Activity Logs' },
  { id: 'faqs', label: 'FAQs' },
];

const CreateUserModal = ({ isOpen, onClose, onUserCreated, activeRoles, activeRolesLoading }) => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: '',
    modules: AVAILABLE_MODULES.reduce((acc, m) => ({ 
      ...acc, 
      [m.id]: m.id === 'dashboard' 
    }), {})
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleModuleToggle = (moduleId) => {
    setForm(prev => ({
      ...prev,
      modules: {
        ...prev.modules,
        [moduleId]: !prev.modules[moduleId]
      }
    }));
  };

  const handleSelectAll = () => {
    const allTrue = AVAILABLE_MODULES.reduce((acc, m) => ({ ...acc, [m.id]: true }), {});
    setForm(prev => ({ ...prev, modules: allTrue }));
  };

  const handleClearAll = () => {
    const allFalse = AVAILABLE_MODULES.reduce((acc, m) => ({ 
      ...acc, 
      [m.id]: m.id === 'dashboard' 
    }), {});
    setForm(prev => ({ ...prev, modules: allFalse }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.role)
      return setError('Please fill in all fields.');

    setLoading(true);
    try {
      await userService.create({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        modules: form.modules
      });
      onUserCreated();
      onClose();
      setForm({ 
        name: '', 
        email: '', 
        password: '', 
        role: '',
        modules: AVAILABLE_MODULES.reduce((acc, m) => ({ ...acc, [m.id]: m.id === 'dashboard' }), {})
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 py-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2.5rem] p-10 max-w-xl w-full mx-4 shadow-2xl border border-white/20 backdrop-blur-sm flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-3xl font-black text-gray-800 mb-6 tracking-tight flex-shrink-0">Create Admin User</h3>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-bold text-gray-700"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-bold text-gray-700"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-bold text-gray-700"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Role <span className="text-red-500">*</span>
                </label>
                {activeRolesLoading ? (
                  <div className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 font-bold">Loading...</div>
                ) : (
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-bold text-gray-700 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select role</option>
                    {activeRoles.map((r) => (
                      <option key={r._id || r.id} value={r._id || r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                  Module Access Control
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[10px] font-black text-orange-600 hover:text-orange-700 transition-colors uppercase tracking-widest"
                  >
                    Select All
                  </button>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[10px] font-black text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_MODULES.map((module) => (
                  <label
                    key={module.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                      form.modules[module.id] 
                        ? 'bg-orange-50/50 border-orange-500' 
                        : 'bg-white border-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <span className={`text-xs font-black uppercase tracking-tight transition-colors ${
                      form.modules[module.id] ? 'text-orange-600' : 'text-gray-500'
                    }`}>
                      {module.label}
                    </span>
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.modules[module.id]}
                        onChange={() => handleModuleToggle(module.id)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
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
        </form>
        
        <div className="flex gap-4 mt-8 flex-shrink-0">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black transition-all shadow-lg shadow-orange-500/20 active:scale-95 disabled:opacity-50 text-lg tracking-tight"
          >
            {loading ? 'Creating...' : 'Create Admin User'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-500 py-5 rounded-2xl font-black transition-all active:scale-95 text-lg tracking-tight"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
