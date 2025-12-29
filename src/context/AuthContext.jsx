import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

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
    try {
      // Use API authentication only
      const response = await authAPI.login({
        email: email.trim(),
        password: password
      });

      const data = response.data;

      if (data && response.status === 200) {
        // Extract token from various possible response structures
        const token =
          data.token ||
          data.access_token ||
          data?.data?.token ||
          data?.data?.access_token;
        
        // Extract user data from various possible response structures
        const userFromApi = data.user || data?.data?.user || data?.admin || data || {};

        // Extract role and normalize it
        // Handle role as string or object
        let role = userFromApi.role || data.role || 'Super Admin';
        let roleKey = userFromApi.roleKey || data.roleKey;
        
        // If role is an object, extract the name property
        if (role && typeof role === 'object' && role !== null) {
          role = role.name || role.roleName || role.role || 'Super Admin';
        }
        
        // Ensure role is a string
        if (typeof role !== 'string') {
          role = String(role || 'Super Admin');
        }
        
        // If roleKey is not provided, derive it from role
        if (!roleKey) {
          // Normalize role string to roleKey format
          const normalizedRole = role.toLowerCase().trim();
          if (normalizedRole.includes('super') || normalizedRole.includes('admin')) {
            roleKey = 'super-admin';
            role = 'Super Admin';
          } else if (normalizedRole.includes('property')) {
            roleKey = 'property-manager';
            role = 'Property Manager';
          } else if (normalizedRole.includes('booking')) {
            roleKey = 'booking-manager';
            role = 'Booking Manager';
          } else if (normalizedRole.includes('staff')) {
            roleKey = 'staff-manager';
            role = 'Staff Manager';
          } else {
            // Default to super-admin for API logins
            roleKey = 'super-admin';
            role = 'Super Admin';
          }
        }

        // Build user data object
        const userData = {
          email: userFromApi.email || data.email || email.trim(),
          role: role,
          roleKey: roleKey,
          description: userFromApi.description || data.description || 'Can create, edit, and delete admin accounts and assign roles/permissions',
          name: userFromApi.name || userFromApi.fullName || data.name || data.fullName || email.split('@')[0],
          token: token,
          apiAuth: true,
          id: userFromApi.id || userFromApi._id || data.id || data._id
        };
        
        // Log for debugging (remove in production)
        console.log('Login successful - User data:', userData);
        
        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        return { success: true };
      }
      
      return { success: false, message: 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      
      // Extract error message from API response
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message || 
        'Invalid email or password. Please try again.';
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const createAccount = (accountData) => {
    const normalizedEmail = accountData.email.toLowerCase().trim();
    
    // Check if email already exists
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

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      const data = response.data;

      if (data && response.status === 200) {
        // Extract user data from various possible response structures
        const userFromApi = data.user || data?.data?.user || data?.admin || data || {};

        // Extract role and normalize it
        // Handle role as string or object
        let role = userFromApi.role || data.role || 'Super Admin';
        let roleKey = userFromApi.roleKey || data.roleKey;

        // If role is an object, extract the name property
        if (role && typeof role === 'object' && role !== null) {
          role = role.name || role.roleName || role.role || 'Super Admin';
        }
        
        // Ensure role is a string
        if (typeof role !== 'string') {
          role = String(role || 'Super Admin');
        }

        // If roleKey is not provided, derive it from role
        if (!roleKey) {
          const normalizedRole = role.toLowerCase().trim();
          if (normalizedRole.includes('super') || normalizedRole.includes('admin')) {
            roleKey = 'super-admin';
            role = 'Super Admin';
          } else if (normalizedRole.includes('property')) {
            roleKey = 'property-manager';
            role = 'Property Manager';
          } else if (normalizedRole.includes('booking')) {
            roleKey = 'booking-manager';
            role = 'Booking Manager';
          } else if (normalizedRole.includes('staff')) {
            roleKey = 'staff-manager';
            role = 'Staff Manager';
          } else {
            roleKey = 'super-admin';
            role = 'Super Admin';
          }
        }

        // Get existing token from localStorage
        const savedUser = localStorage.getItem('adminUser');
        let existingToken = null;
        if (savedUser) {
          try {
            const existingUserData = JSON.parse(savedUser);
            existingToken = existingUserData.token;
          } catch (e) {
            console.error('Error parsing existing user data:', e);
          }
        }

        // Build updated user data object
        const userData = {
          email: userFromApi.email || data.email || user?.email,
          role: role,
          roleKey: roleKey,
          description: userFromApi.description || data.description || user?.description || 'Can create, edit, and delete admin accounts and assign roles/permissions',
          name: userFromApi.name || userFromApi.fullName || data.name || data.fullName || user?.name,
          token: existingToken || user?.token, // Keep existing token
          apiAuth: true,
          id: userFromApi.id || userFromApi._id || data.id || data._id || user?.id
        };

        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        return { success: true, user: userData };
      }

      return { success: false, message: 'Failed to refresh user data' };
    } catch (error) {
      console.error('Refresh user error:', error);
      
      // If refresh fails, it might mean token is invalid
      // Don't logout automatically, let the component handle it
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Failed to refresh user data'
      };
    }
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
      refreshUser,
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

