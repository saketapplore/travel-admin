import { useState, useEffect, useCallback } from 'react';
import { roleService } from '@/services/roleService';
import { permissionService } from '@/services/permissionService';

export const useRolesPermissions = () => {
  const [rolesSubSection, setRolesSubSection] = useState('roles');
  const [rolesData, setRolesData] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState('');

  const [permissionsData, setPermissionsData] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsError, setPermissionsError] = useState('');
  const [permissionPage, setPermissionPage] = useState(1);
  const PERMISSION_PAGE_SIZE = 10;

  const fetchRoles = useCallback(async () => {
    setRolesLoading(true);
    setRolesError('');
    try {
      const response = await roleService.getAll();
      const data = response?.data?.data || response?.data || [];
      const rolesArray = Array.isArray(data) ? data : [];

      const normalizedRoles = rolesArray.map((role) => {
        const isEnabled =
          role.isEnabled !== undefined
            ? role.isEnabled
            : role.isActive || role.active || role.status === 'enabled' || role.status === 'active';
        return {
          ...role,
          isEnabled,
          status: role.status || (isEnabled ? 'enabled' : 'disabled')
        };
      });
      setRolesData(normalizedRoles);
    } catch (error) {
      setRolesError(error.response?.data?.message || 'Failed to load roles.');
    } finally {
      setRolesLoading(false);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    setPermissionsLoading(true);
    setPermissionsError('');
    try {
      const response = await permissionService.getAll();
      const data = response?.data?.data || response?.data || [];
      setPermissionsData(Array.isArray(data) ? data : []);
    } catch (error) {
      setPermissionsError(error.response?.data?.message || 'Failed to load permissions.');
    } finally {
      setPermissionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (rolesSubSection === 'roles') fetchRoles();
    fetchPermissions(); // Load permissions for both tabs
  }, [rolesSubSection, fetchRoles, fetchPermissions]);

  const handleEnableRole = async (id) => {
    try {
      await roleService.enable(id);
      await fetchRoles();
    } catch (error) {
      alert('Failed to enable role.');
    }
  };

  const handleDisableRole = async (id) => {
    if (!window.confirm('Are you sure you want to disable this role?')) return;
    try {
      await roleService.disable(id);
      await fetchRoles();
    } catch (error) {
      alert('Failed to disable role.');
    }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm('Are you sure you want to delete this role? This action cannot be undone.'))
      return;
    try {
      await roleService.delete(id);
      await fetchRoles();
    } catch (error) {
      alert('Failed to delete role.');
    }
  };

  return {
    rolesSubSection,
    setRolesSubSection,
    rolesData,
    rolesLoading,
    rolesError,
    fetchRoles,
    permissionsData,
    permissionsLoading,
    permissionsError,
    permissionPage,
    setPermissionPage,
    PERMISSION_PAGE_SIZE,
    handleEnableRole,
    handleDisableRole,
    handleDeleteRole
  };
};
