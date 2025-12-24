import React, { useState } from 'react';
import { useProperties } from '../../context/PropertyContext';
import Sidebar from '../../components/Sidebar';
import PropertyManagement from './components/PropertyManagement';
import AdminAccounts from './components/AdminAccounts';
import AdminUsers from './components/AdminUsers';
import RolesPermissions from './components/RolesPermissions';
import BookingManagement from './components/BookingManagement';
import DiscountsPackages from './components/DiscountsPackages';
import FinancialManagement from './components/FinancialManagement';
import ReportingAnalytics from './components/ReportingAnalytics';
import ActivityLogs from './components/ActivityLogs';
import FAQs from './components/FAQs';

const SuperAdminDashboard = () => {
  // Active Section State
  const [activeSection, setActiveSection] = useState('properties');
  const { propertyManagers } = useProperties();

  return (
    <div className="relative">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 min-w-0 lg:ml-[280px] lg:pl-0">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Super Admin Dashboard</h2>
          <p className="text-gray-600">
            {activeSection === 'properties' 
              ? 'Manage properties and assign them to property managers'
              : activeSection === 'admins'
              ? 'Create, edit, and delete admin accounts and assign roles/permissions'
              : activeSection === 'users'
              ? 'Manage admin users and their activation status'
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
              : activeSection === 'faqs'
              ? 'Manage frequently asked questions and answers'
              : 'Generate reports on bookings, revenue, occupancy, and view staff performance metrics'}
          </p>
        </div>

        {activeSection === 'properties' && <PropertyManagement propertyManagers={propertyManagers} />}
        {activeSection === 'admins' && <AdminAccounts />}
        {activeSection === 'users' && <AdminUsers />}
        {activeSection === 'roles' && <RolesPermissions />}
        {activeSection === 'bookings' && <BookingManagement />}
        {activeSection === 'discounts' && <DiscountsPackages />}
        {activeSection === 'financial' && <FinancialManagement />}
        {activeSection === 'reporting' && <ReportingAnalytics />}
        {activeSection === 'logs' && <ActivityLogs />}
        {activeSection === 'faqs' && <FAQs />}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
