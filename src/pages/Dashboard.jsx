import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import PropertyManagerDashboard from './dashboards/PropertyManagerDashboard';
import BookingManagerDashboard from './dashboards/BookingManagerDashboard';
import StaffManagerDashboard from './dashboards/StaffManagerDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.roleKey) {
      case 'super-admin':
        return <SuperAdminDashboard />;
      case 'property-manager':
        return <PropertyManagerDashboard />;
      case 'booking-manager':
        return <BookingManagerDashboard />;
      case 'staff-manager':
        return <StaffManagerDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;

