import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertyContext';
import Sidebar from '../../components/Sidebar';
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
import StayManagement from './components/StayManagement';

const SuperAdminDashboard = () => {
  const { user, canAccess } = useAuth();
  const { propertyManagers } = useProperties();

  // Define sections and their corresponding modules
  const sections = [
    // { id: 'dashboard', module: 'dashboard' },
    { id: 'stays', module: 'stayManagement' },
    { id: 'users', module: 'adminUsers' },
    { id: 'roles', module: 'rolesPermissions' },
    { id: 'bookings', module: 'bookings' },
    { id: 'discounts', module: 'discounts' },
    { id: 'transactions', module: 'transactions' },
    { id: 'financial-setting', module: 'financialSetting' },
    { id: 'reporting', module: 'reporting' },
    { id: 'logs', module: 'logs' },
    { id: 'faqs', module: 'faqs' }
  ];

  const isSuperAdmin = user?.role === 'Super Admin' || (typeof user?.role === 'object' && user?.role?.name === 'Super Admin');

  const isSectionPermitted = (sectionId) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return false;
    return canAccess(section.module, 'view');
  };

  const permittedSections = sections.filter(s => isSectionPermitted(s.id));

  // Active Section State
  const [activeSection, setActiveSection] = useState(() => {
    const savedSection = localStorage.getItem('superAdminActiveSection');
    if (savedSection && isSectionPermitted(savedSection)) {
      return savedSection;
    }
    return permittedSections[0]?.id || 'stays';
  });

  // Save active section to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('superAdminActiveSection', activeSection);
  }, [activeSection]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="relative">
      <Sidebar activeSection={activeSection} setActiveSection={handleSectionChange} />
      <div className="flex-1 min-w-0 lg:ml-[320px] lg:pl-0">
        {!isSectionPermitted(activeSection) ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white rounded-3xl shadow-xl p-12 border border-gray-100 text-center mx-6">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m12-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-3 tracking-tight">Access Restricted</h2>
            <p className="text-gray-500 max-w-sm mx-auto font-medium">You don't have module-level access for this section. Please contact your system administrator.</p>
          </div>
        ) : (
          <div className="p-6 lg:p-0">
            {/* {activeSection === 'dashboard' && <div className="p-8 text-2xl font-bold">Welcome to Dashboard</div>} */}
            {activeSection === 'stays' && <StayManagement />}
            {activeSection === 'admins' && isSuperAdmin && <AdminAccounts />}
            {activeSection === 'users' && <AdminUsers />}
            {activeSection === 'roles' && <RolesPermissions />}
            {activeSection === 'bookings' && <BookingManagement />}
            {activeSection === 'discounts' && <DiscountsPackages />}
            {activeSection === 'transactions' && <FinancialManagement />}
            {activeSection === 'financial-setting' && <PlatformFee />}
            {activeSection === 'reporting' && <ReportingAnalytics />}
            {activeSection === 'logs' && <ActivityLogs />}
            {activeSection === 'faqs' && <FAQs />}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
