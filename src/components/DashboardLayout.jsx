import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { UserCircle, LogOut, BedDouble, Plane } from 'lucide-react';
import logo from '../assets/logo.png';
import NotificationBell from './NotificationBell';
import { useAdminNotifications } from '../hooks/useAdminNotifications';

const DashboardLayout = ({ children }) => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [name, setName] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);
  const { bells, markRead } = useAdminNotifications();

  const isSuperAdminOrAdmin = () => {
    let roleKey = user?.roleKey;
    if (roleKey && typeof roleKey === 'string') {
      roleKey = roleKey.toLowerCase().trim();
    } else if (roleKey) {
      roleKey = String(roleKey).toLowerCase().trim();
    } else {
      roleKey = 'super-admin';
    }
    return roleKey === 'super-admin' || roleKey === 'superadmin' || roleKey === 'admin';
  };

  // Get first character of user's name or email
  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    } else if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'A';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
  };

  const handleEditProfile = () => {
    setShowDropdown(false);
    setName(user?.name || '');
    setError('');
    setShowEditProfileModal(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setUpdating(true);

    if (!name || name.trim() === '') {
      setError('Name is required');
      setUpdating(false);
      return;
    }

    try {
      const response = await userService.update({ name: name.trim() });
      console.log('Profile update response:', response);

      // Refresh user data to get updated information
      if (refreshUser) {
        await refreshUser();
      }

      // Close modal
      setShowEditProfileModal(false);
      setName('');
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to update profile. Please try again.';
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{ backgroundImage: "url('/src/assets/image.png')" }}
    >
      {/* Light Overlay to ensure readability */}
      <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>

      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 bg-orange-500/90 backdrop-blur-md text-white shadow-lg z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Logo"
                className="w-12 h-12 object-contain bg-white/20 p-1.5 rounded-xl shadow-inner border border-white/10"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight leading-none mb-1">ADMIN PANEL</h1>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wider">
                  Travel Rumours
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Real-time notification bells: Stay By TR + Hotel & Flight */}
              <div className="flex items-center gap-2">
                <NotificationBell
                  icon={BedDouble}
                  label="Stay By TR"
                  bell={{ ...bells.stays, onOpen: () => markRead('stays') }}
                />
                <NotificationBell
                  icon={Plane}
                  label="Hotel & Flight"
                  bell={{ ...bells.travel, onOpen: () => markRead('travel') }}
                />
              </div>
              <div className="text-right">
                <p className="font-semibold">{user?.role?.name || (typeof user?.role === 'string' ? user.role : 'Admin')}</p>
                <p className="text-sm text-orange-100">{user?.email}</p>
              </div>
              {/* User Avatar Circle with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full bg-white text-orange-500 font-bold text-lg flex items-center justify-center hover:bg-orange-50 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
                  aria-label="User menu"
                >
                  {getInitial()}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Account
                      </p>
                    </div>
                    <button
                      onClick={handleEditProfile}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition duration-150 flex items-center gap-3"
                    >
                      <UserCircle className="w-5 h-5 opacity-70" />
                      <span className="font-medium">Edit Profile</span>
                    </button>
                    {!isSuperAdminOrAdmin() && (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition duration-150 flex items-center gap-3 border-t border-gray-50"
                      >
                        <LogOut className="w-5 h-5 opacity-70" />
                        <span className="font-medium">Logout</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Add padding-top to account for fixed header */}
      <main className="w-full px-6 pb-8 pt-24">{children}</main>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 my-8">
            <h3 className="text-2xl font-bold mb-6">Edit Profile</h3>
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                    {error}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProfileModal(false);
                    setName('');
                    setError('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition duration-200"
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

export default DashboardLayout;
