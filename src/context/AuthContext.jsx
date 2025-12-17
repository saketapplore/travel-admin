import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// Hardcoded Admin credentials for admin panel
const HARDCODED_ADMIN_CREDENTIALS = {
  email: 'ayush.rajput@applore.in',
  password: 'Applore@123',
  role: 'Super Admin',
  roleKey: 'super-admin',
  description: 'Can create, edit, and delete admin accounts and assign roles/permissions'
};

// Default Super Admin credential (cannot be deleted)
const SUPER_ADMIN_CREDENTIAL = {
  email: 'superadmin@travelrumors.com',
  password: 'superadmin123',
  role: 'Super Admin',
  roleKey: 'super-admin',
  description: 'Can create, edit, and delete admin accounts and assign roles/permissions'
};

// Role configurations
const ROLE_CONFIGS = {
  'property-manager': {
    role: 'Property Manager',
    description: 'Can manage property details, availability, and bookings assigned to them'
  },
  'booking-manager': {
    role: 'Booking Manager',
    description: 'Can view and manage booking requests, confirmations, cancellations, and payments'
  },
  'staff-manager': {
    role: 'Staff Manager',
    description: 'Can onboard staff members, assign bookings, and manage staff roles'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAccounts, setUserAccounts] = useState([]);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Load user accounts from localStorage
    const savedAccounts = localStorage.getItem('userAccounts');
    if (savedAccounts) {
      setUserAccounts(JSON.parse(savedAccounts));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = email.toLowerCase().trim();
    
    try {
      // First, check hardcoded admin credentials
      if (
        normalizedEmail === HARDCODED_ADMIN_CREDENTIALS.email.toLowerCase() &&
        password === HARDCODED_ADMIN_CREDENTIALS.password
      ) {
        // Generate a mock token for hardcoded admin to allow API calls
        const mockToken = `hardcoded_admin_${btoa(HARDCODED_ADMIN_CREDENTIALS.email)}_${Date.now()}`;
        const userData = {
          email: HARDCODED_ADMIN_CREDENTIALS.email,
          role: HARDCODED_ADMIN_CREDENTIALS.role,
          roleKey: HARDCODED_ADMIN_CREDENTIALS.roleKey,
          description: HARDCODED_ADMIN_CREDENTIALS.description,
          name: email.split('@')[0],
          token: mockToken,
          apiAuth: false,
          isHardcoded: true
        };
        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        return { success: true };
      }

      // Try API authentication
      const response = await authAPI.login({
        email: email.trim(),
        password: password
      });

      const data = response.data;

      if (data && response.status === 200) {
        // Flatten token and user from possible nests (data.token, data.data.token, etc.)
        const token =
          data.token ||
          data.access_token ||
          data?.data?.token ||
          data?.data?.access_token;
        const userFromApi = data.user || data?.data?.user || {};

        // Successful API login - set as Super Admin
        const userData = {
          email: userFromApi.email || email.trim(),
          role: 'Super Admin',
          roleKey: 'super-admin',
          description: 'Can create, edit, and delete admin accounts and assign roles/permissions',
          name: userFromApi.name || data.name || email.split('@')[0],
          token,
          apiAuth: true
        };
        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        return { success: true };
      }

      // If API response is not successful, check local created accounts
      const account = userAccounts.find(acc => acc.email.toLowerCase() === normalizedEmail);
      
      if (account && account.password === password) {
        const userData = {
          email: account.email,
          role: account.role,
          roleKey: account.roleKey,
          description: account.description,
          name: account.name,
          apiAuth: false
        };
        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        return { success: true };
      }
      
      return { success: false, message: 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      
      // Check hardcoded admin credentials as fallback
      if (
        normalizedEmail === HARDCODED_ADMIN_CREDENTIALS.email.toLowerCase() &&
        password === HARDCODED_ADMIN_CREDENTIALS.password
      ) {
        // Generate a mock token for hardcoded admin to allow API calls
        const mockToken = `hardcoded_admin_${btoa(HARDCODED_ADMIN_CREDENTIALS.email)}_${Date.now()}`;
        const userData = {
          email: HARDCODED_ADMIN_CREDENTIALS.email,
          role: HARDCODED_ADMIN_CREDENTIALS.role,
          roleKey: HARDCODED_ADMIN_CREDENTIALS.roleKey,
          description: HARDCODED_ADMIN_CREDENTIALS.description,
          name: email.split('@')[0],
          token: mockToken,
          apiAuth: false,
          isHardcoded: true
        };
        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        return { success: true };
      }
      
      // Fallback to local accounts if API fails
      const account = userAccounts.find(acc => acc.email.toLowerCase() === normalizedEmail);
      
      if (account && account.password === password) {
        const userData = {
          email: account.email,
          role: account.role,
          roleKey: account.roleKey,
          description: account.description,
          name: account.name,
          apiAuth: false
        };
        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        return { success: true };
      }
      
      return { 
        success: false, 
        message: error.message || 'Invalid email or password. Please try again.' 
      };
    }
  };

  const createAccount = (accountData) => {
    const normalizedEmail = accountData.email.toLowerCase().trim();
    
    // Check if email already exists
    if (normalizedEmail === SUPER_ADMIN_CREDENTIAL.email.toLowerCase()) {
      return { success: false, message: 'This email is reserved for Super Admin' };
    }

    const emailExists = userAccounts.find(acc => acc.email.toLowerCase() === normalizedEmail);
    if (emailExists) {
      return { success: false, message: 'An account with this email already exists' };
    }

    const roleConfig = ROLE_CONFIGS[accountData.roleKey];
    if (!roleConfig) {
      return { success: false, message: 'Invalid role selected' };
    }

    const newAccount = {
      id: Date.now(),
      name: accountData.name,
      email: accountData.email,
      password: accountData.password,
      role: roleConfig.role,
      roleKey: accountData.roleKey,
      description: roleConfig.description,
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    const updatedAccounts = [...userAccounts, newAccount];
    setUserAccounts(updatedAccounts);
    localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));

    return { success: true, account: newAccount };
  };

  const updateAccount = (id, updates) => {
    const updatedAccounts = userAccounts.map(acc => {
      if (acc.id === id) {
        return { ...acc, ...updates };
      }
      return acc;
    });
    setUserAccounts(updatedAccounts);
    localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
    return { success: true };
  };

  const deleteAccount = (id) => {
    const updatedAccounts = userAccounts.filter(acc => acc.id !== id);
    setUserAccounts(updatedAccounts);
    localStorage.setItem('userAccounts', JSON.stringify(updatedAccounts));
    return { success: true };
  };

  const getAllAccounts = () => {
    return userAccounts;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      createAccount,
      updateAccount,
      deleteAccount,
      getAllAccounts,
      userAccounts
    }}>
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

