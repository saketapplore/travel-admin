import React, { useState } from 'react';
import { useProperties } from '../../context/PropertyContext';
import PropertyManagement from './components/PropertyManagement';
import AdminAccounts from './components/AdminAccounts';
import RolesPermissions from './components/RolesPermissions';
import BookingManagement from './components/BookingManagement';
import DiscountsPackages from './components/DiscountsPackages';
import FinancialManagement from './components/FinancialManagement';
import ReportingAnalytics from './components/ReportingAnalytics';
import ActivityLogs from './components/ActivityLogs';

const SuperAdminDashboard = () => {
  // Active Section State
  const [activeSection, setActiveSection] = useState('properties');
  const { propertyManagers } = useProperties();

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-6">
      <aside className="lg:w-64 w-full mb-6 lg:mb-0">
        <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Sections</h3>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('properties')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'properties'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏢 Property Management
            </button>
            <button
              onClick={() => setActiveSection('admins')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'admins'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              👥 Admin Accounts
            </button>
            <button
              onClick={() => setActiveSection('roles')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'roles'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🔐 Roles & Permissions
            </button>
            <button
              onClick={() => setActiveSection('bookings')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'bookings'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📅 Booking Management
            </button>
            <button
              onClick={() => setActiveSection('discounts')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'discounts'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🎁 Discounts & Packages
            </button>
            <button
              onClick={() => setActiveSection('financial')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'financial'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              💰 Financial Management
            </button>
            <button
              onClick={() => setActiveSection('reporting')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'reporting'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📊 Reporting & Analytics
            </button>
            <button
              onClick={() => setActiveSection('logs')}
              className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 ${
                activeSection === 'logs'
                  ? 'bg-orange-500 text-white font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📝 Activity Logs
            </button>
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Super Admin Dashboard</h2>
          <p className="text-gray-600">
            {activeSection === 'properties' 
              ? 'Manage properties and assign them to property managers'
              : activeSection === 'admins'
              ? 'Create, edit, and delete admin accounts and assign roles/permissions'
              : activeSection === 'roles'
              ? 'Define roles and manage permissions for different user types'
              : activeSection === 'bookings'
              ? 'Approve or reject booking requests and manage booking details'
              : activeSection === 'discounts'
              ? 'Create promotional offers, discount codes, and custom packages for users'
              : activeSection === 'financial'
              ? 'View and track all transactions, generate GST-compliant invoices for bookings'
              : activeSection === 'reporting'
              ? 'Generate reports on bookings, revenue, occupancy, and view staff performance metrics'
              : activeSection === 'logs'
              ? 'View activity logs from Property Managers, Staff Managers, and Booking Managers'
              : 'Generate reports on bookings, revenue, occupancy, and view staff performance metrics'}
          </p>
        </div>

        {activeSection === 'properties' && <PropertyManagement propertyManagers={propertyManagers} />}
        {activeSection === 'admins' && <AdminAccounts />}
        {activeSection === 'roles' && <RolesPermissions />}
        {activeSection === 'bookings' && <BookingManagement />}
        {activeSection === 'discounts' && <DiscountsPackages />}
        {activeSection === 'financial' && <FinancialManagement />}
        {activeSection === 'reporting' && <ReportingAnalytics />}
        {activeSection === 'logs' && <ActivityLogs />}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
