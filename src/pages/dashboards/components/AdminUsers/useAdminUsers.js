import { useState, useEffect, useCallback, useMemo } from 'react';
import { userService } from '@/services/userService';
import { roleService } from '@/services/roleService';
import { permissionService } from '@/services/permissionService';
import { useAuth } from '@/context/AuthContext';

export const useAdminUsers = () => {
  const { user: authUser, refreshUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [activeRoles, setActiveRoles] = useState([]);
  const [activeRolesLoading, setActiveRolesLoading] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchRoles = useCallback(async () => {
    setRolesLoading(true);
    try {
      const response = await roleService.getAll();
      setRoles(
        Array.isArray(response?.data?.data || response?.data)
          ? response?.data?.data || response?.data
          : []
      );
    } catch (error) {
      console.error('Roles fetch error:', error);
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const fetchActiveRoles = useCallback(async () => {
    setActiveRolesLoading(true);
    try {
      const response = await roleService.getActive();
      setActiveRoles(
        Array.isArray(response?.data?.data || response?.data)
          ? response?.data?.data || response?.data
          : []
      );
    } catch (error) {
      console.error('Active roles fetch error:', error);
      setActiveRoles(roles);
    } finally {
      setActiveRolesLoading(false);
    }
  }, [roles]);

  const fetchPermissions = useCallback(async () => {
    setPermissionsLoading(true);
    try {
      const response = await permissionService.getAll();
      setAvailablePermissions(
        Array.isArray(response?.data?.data || response?.data)
          ? response?.data?.data || response?.data
          : []
      );
    } catch (error) {
      console.error('Permissions fetch error:', error);
    } finally {
      setPermissionsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await userService.getAll({ limit: 1000 });
      const usersArray = Array.isArray(response?.data?.data || response?.data)
        ? response?.data?.data || response?.data
        : [];
      const normalizedUsers = usersArray.map((user) => {
        const statusValue = user.status?.toLowerCase() || '';
        const isActive =
          user.isActive !== undefined
            ? user.isActive
            : statusValue === 'active' || statusValue === 'enabled';
        return { ...user, isActive, status: user.status || (isActive ? 'active' : 'inactive') };
      });
      setUsers(normalizedUsers);
    } catch (error) {
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleEnableUser = async (id) => {
    const userToEnable = users.find((u) => (u._id || u.id) === id);
    setUsers((prev) =>
      prev.map((u) => ((u._id || u.id) === id ? { ...u, isActive: true, status: 'active' } : u))
    );
    try {
      await userService.activate(id);
      await fetchUsers();
    } catch (error) {
      if (userToEnable)
        setUsers((prev) => prev.map((u) => ((u._id || u.id) === id ? userToEnable : u)));
      setError('Failed to enable user.');
    }
  };

  const handleDisableUser = async (id) => {
    const userToDisable = users.find((u) => (u._id || u.id) === id);
    setUsers((prev) =>
      prev.map((u) => ((u._id || u.id) === id ? { ...u, isActive: false, status: 'inactive' } : u))
    );
    try {
      await userService.deactivate(id);
      await fetchUsers();
    } catch (error) {
      if (userToDisable)
        setUsers((prev) => prev.map((u) => ((u._id || u.id) === id ? userToDisable : u)));
      setError('Failed to disable user.');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await userService.delete(id);
      await fetchUsers();
    } catch (error) {
      setError('Failed to delete user.');
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === '' ||
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === '' ||
        (() => {
          const userRole = user.role || user.roleName;
          if (!userRole) return false;
          if (typeof userRole === 'object') return (userRole._id || userRole.id) === roleFilter;
          const selectedRole = roles.find((r) => (r._id || r.id) === roleFilter);
          return (
            selectedRole &&
            userRole.toString().toLowerCase() ===
              (selectedRole.name || selectedRole.roleName || '').toLowerCase()
          );
        })();

      const matchesStatus =
        statusFilter === '' || (statusFilter === 'active' ? user.isActive : !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter, roles]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  return {
    users,
    loading,
    error,
    setError,
    roles,
    activeRoles,
    activeRolesLoading,
    availablePermissions,
    permissionsLoading,
    fetchActiveRoles,
    fetchPermissions,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    currentUsers,
    filteredUsers,
    itemsPerPage,
    handleEnableUser,
    handleDisableUser,
    handleDeleteUser,
    fetchUsers,
    authUser,
    refreshUser
  };
};
