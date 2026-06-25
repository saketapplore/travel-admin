import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing saved user:', e);
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({
        email: email.trim(),
        password: password
      });

      const data = response.data;

      if (data && response.status === 200) {
        const token = data.token || data.access_token || data?.data?.token || data?.data?.access_token;
        const userFromApi = data.user || data?.data?.user || data?.admin || data || {};

        const role = userFromApi.role || 'Staff';
        const roleName = typeof role === 'object' ? role.name : role;
        
        const userData = {
          id: userFromApi.id || userFromApi._id || data.id || data._id,
          email: userFromApi.email || data.email || email.trim(),
          name: userFromApi.name || userFromApi.fullName || data.name || data.fullName || email.split('@')[0],
          role: role,
          roleKey: roleName?.toLowerCase()?.replace(/\s+/g, '-') || 'staff',
          modules: userFromApi.modules || {},
          token: token,
          apiAuth: true
        };

        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        // Reset the remembered dashboard tab so a fresh login always lands on
        // the default landing view (Reporting & Analytics).
        localStorage.removeItem('superAdminActiveSection');
        return { success: true };
      }

      return { success: false, message: 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password. Please try again.'
      };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      const data = response.data;

      if (data && response.status === 200) {
        const userFromApi = data.user || data?.data?.user || data?.admin || data || {};
        
        const savedUser = localStorage.getItem('adminUser');
        let existingToken = null;
        if (savedUser) {
          try {
            existingToken = JSON.parse(savedUser).token;
          } catch (e) {}
        }

        const role = userFromApi.role || 'Staff';
        const roleName = typeof role === 'object' ? role.name : role;

        const userData = {
          id: userFromApi.id || userFromApi._id,
          email: userFromApi.email,
          name: userFromApi.name,
          role: role,
          roleKey: roleName?.toLowerCase()?.replace(/\s+/g, '-') || 'staff',
          modules: userFromApi.modules || {},
          token: existingToken || user?.token,
          apiAuth: true
        };

        setUser(userData);
        localStorage.setItem('adminUser', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: 'Failed to refresh user data' };
    } catch (error) {
      console.error('Refresh user error:', error);
      return { success: false, message: 'Failed to refresh user data' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  /**
   * Centralized Permission Check helper for UI
   * Logic: User can perform an action IF:
   * 1. The module is assigned to the user
   * AND
   * 2. The role allows that action (view/create/edit/delete)
   */
  const canAccess = useCallback((module, action = 'view') => {
    if (!user) return false;
    
    const roleName = user.role?.name || (typeof user.role === 'string' ? user.role : '');
    if (roleName === 'Super Admin') return true;

    // 1. Check User-Level Module Access
    const hasModuleAccess = user.modules?.[module] === true;
    if (!hasModuleAccess) return false;

    // 2. Check Role-Level Action Permission
    const rolePermissions = user.role?.permissions;
    
    // Legacy support: If 'view' isn't explicitly defined as a boolean, 
    // it's an old array-based role. Assume it has basic view access
    // so we don't lock out existing users before their roles are migrated
    if (rolePermissions && typeof rolePermissions.view !== 'boolean') {
      if (action === 'view') return true;
      return false; // Can't definitively know edit/delete for legacy, deny by default
    }

    return (rolePermissions || {})[action] === true;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        refreshUser,
        canAccess
      }}
    >
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
