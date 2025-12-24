import React from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import SuperAdminDashboard from './dashboards/SuperAdminDashboard';
import PropertyManagerDashboard from './dashboards/PropertyManagerDashboard';
import BookingManagerDashboard from './dashboards/BookingManagerDashboard';
import StaffManagerDashboard from './dashboards/StaffManagerDashboard';

const Dashboard = () => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  // If no user, redirect will be handled by ProtectedRoute
  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    // Normalize roleKey to handle variations
    const roleKey = user?.roleKey?.toLowerCase()?.trim();
    
    switch (roleKey) {
      case 'super-admin':
      case 'superadmin':
      case 'admin':
        return <SuperAdminDashboard />;
      case 'property-manager':
      case 'propertymanager':
        return <PropertyManagerDashboard />;
      case 'booking-manager':
      case 'bookingmanager':
        return <BookingManagerDashboard />;
      case 'staff-manager':
      case 'staffmanager':
        return <StaffManagerDashboard />;
      default:
        // Default to Super Admin for API logins if role is not recognized
        console.warn('Unknown roleKey:', roleKey, 'Defaulting to Super Admin');
        return <SuperAdminDashboard />;
    }
  };

  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;


