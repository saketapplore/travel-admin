import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 bg-orange-500 text-white shadow-lg z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">ADMIN PANEL</h1>
              <p className="text-orange-100 text-sm">Travel Rumors Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
               
                <p className="font-semibold">{user?.role || 'Admin'}</p>
                <p className="text-sm text-orange-100">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white text-orange-500 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition duration-200 shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Add padding-top to account for fixed header */}
      <main className="container mx-auto px-6 py-8 pt-24">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

