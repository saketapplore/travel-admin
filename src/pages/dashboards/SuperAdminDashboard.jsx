import React, { useState, useEffect } from 'react';
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
import PlatformFee from './components/PlatformFee';

const SuperAdminDashboard = () => {
  // Active Section State - Initialize from localStorage or default to 'properties'
  const [activeSection, setActiveSection] = useState(() => {
    const savedSection = localStorage.getItem('superAdminActiveSection');
    return savedSection || 'properties';
  });
  const { propertyManagers } = useProperties();

  // Save active section to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('superAdminActiveSection', activeSection);
  }, [activeSection]);

  // Handler to update active section
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="relative">
      <Sidebar activeSection={activeSection} setActiveSection={handleSectionChange} />
      <div className="flex-1 min-w-0 lg:ml-[320px] lg:pl-0">
        {activeSection === 'properties' && (
          <PropertyManagement propertyManagers={propertyManagers} />
        )}
        {activeSection === 'admins' && <AdminAccounts />}
        {activeSection === 'users' && <AdminUsers />}
        {activeSection === 'roles' && <RolesPermissions />}
        {activeSection === 'bookings' && <BookingManagement />}
        {activeSection === 'discounts' && <DiscountsPackages />}
        {activeSection === 'financial' && <FinancialManagement />}
        {activeSection === 'reporting' && <ReportingAnalytics />}
        {activeSection === 'logs' && <ActivityLogs />}
        {activeSection === 'faqs' && <FAQs />}
        {activeSection === 'platform-fee' && <PlatformFee />}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
