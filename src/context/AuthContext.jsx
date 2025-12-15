import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Hardcoded credentials with email and password for each role
const CREDENTIALS = {
  'superadmin@travelrumors.com': {
    email: 'superadmin@travelrumors.com',
    password: 'superadmin123',
    role: 'Super Admin',
    roleKey: 'super-admin',
    description: 'Can create, edit, and delete admin accounts and assign roles/permissions'
  },
  'propertymanager@travelrumors.com': {
    email: 'propertymanager@travelrumors.com',
    password: 'property123',
    role: 'Property Manager',
    roleKey: 'property-manager',
    description: 'Can manage property details, availability, and bookings assigned to them'
  },
  'bookingmanager@travelrumors.com': {
    email: 'bookingmanager@travelrumors.com',
    password: 'booking123',
    role: 'Booking Manager',
    roleKey: 'booking-manager',
    description: 'Can view and manage booking requests, confirmations, cancellations, and payments'
  },
  'staffmanager@travelrumors.com': {
    email: 'staffmanager@travelrumors.com',
    password: 'staff123',
    role: 'Staff Manager',
    roleKey: 'staff-manager',
    description: 'Can onboard staff members, assign bookings, and manage staff roles'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Normalize email to lowercase for case-insensitive matching
    const normalizedEmail = email.toLowerCase().trim();
    const credential = CREDENTIALS[normalizedEmail];
    
    if (credential && credential.password === password) {
      const userData = {
        email: credential.email,
        role: credential.role,
        roleKey: credential.roleKey,
        description: credential.description
      };
      setUser(userData);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

