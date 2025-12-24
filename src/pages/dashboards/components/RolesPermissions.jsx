import React, { useState, useEffect } from 'react';
import { permissionAPI, roleAPI } from '../../../services/api';
import { EditIcon } from '../../../components/icons';

const RolesPermissions = () => {
  const [rolesSubSection, setRolesSubSection] = useState('roles');
  
  // Permissions (API) State
  const [permissionsData, setPermissionsData] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsError, setPermissionsError] = useState('');
  const [permissionPage, setPermissionPage] = useState(1);
  const PERMISSION_PAGE_SIZE = 10;

  // Helper to render permission label safely
  const permissionLabel = (perm) =>
    perm?.name ||
    perm?.permissionName ||
    perm?.displayName ||
    perm?.title ||
    perm?.code ||
    perm?.slug ||
    perm?._id ||
    perm?.id ||
    (typeof perm === 'string' ? perm : JSON.stringify(perm));

  // Roles (API) State
  const [rolesData, setRolesData] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState('');
  const [permissionsTable, setPermissionsTable] = useState([]);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] });
  const [roleFormError, setRoleFormError] = useState('');
  const [availablePermissions, setAvailablePermissions] = useState([]);

  // Fetch roles when Roles tab is active
  useEffect(() => {
    const fetchRoles = async () => {
      if (rolesSubSection !== 'roles') return;
      setRolesLoading(true);
      setRolesError('');
      
      try {
        const response = await roleAPI.getAll();
        // Handle various response structures
        const data = response?.data?.data || response?.data || [];
        const rolesArray = Array.isArray(data) ? data : [];
        
        console.log('Initial fetch - Raw roles from API:', rolesArray);
        
        // Normalize roles to ensure consistent structure
        const normalizedRoles = rolesArray.map(role => {
          // Check multiple possible fields for enabled status
          const statusValue = role.status?.toLowerCase() || '';
          const isActive = role.isActive !== undefined ? role.isActive : null;
          const active = role.active !== undefined ? role.active : null;
          const enabled = role.enabled !== undefined ? role.enabled : null;
          
          // Determine if role is enabled from multiple sources
          let isEnabledValue = false;
          
          if (role.isEnabled !== undefined) {
            isEnabledValue = role.isEnabled;
          } else if (isActive !== null) {
            isEnabledValue = isActive;
          } else if (active !== null) {
            isEnabledValue = active;
          } else if (enabled !== null) {
            isEnabledValue = enabled;
          } else if (statusValue) {
            isEnabledValue = (statusValue === 'enabled' || statusValue === 'active' || statusValue === 'enable');
          }
          
          const normalized = {
            ...role,
            isEnabled: isEnabledValue,
            status: role.status || (isEnabledValue ? 'enabled' : 'disabled')
          };
          
          console.log(`Role "${role.name || role.roleName}":`, {
            original: role,
            normalized: normalized,
            statusValue,
            isActive,
            active,
            enabled,
            finalIsEnabled: isEnabledValue
          });
          
          return normalized;
        });
        
        console.log('Initial fetch - Normalized roles:', normalizedRoles);
        setRolesData(normalizedRoles);
        setRolesError('');
      } catch (error) {
        console.error('Roles fetch error:', error);
        
        // Extract error message from API response
        const errorMessage = 
          error.response?.data?.message || 
          error.response?.data?.error ||
          error.message || 
          'Failed to load roles. Please try again.';
        
        if (error.response?.status === 401) {
          setRolesError('Authentication required. Please try refreshing the page.');
        } else if (error.response?.status === 403) {
          setRolesError('Access denied. You do not have permission to view roles.');
        } else {
          setRolesError(errorMessage);
        }
        
        setRolesData([]);
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, [rolesSubSection]);

  // Fetch permissions when Permissions tab is active or when roles tab is active (for role form)
  useEffect(() => {
    const fetchPermissions = async () => {
      // Fetch permissions for both tabs to ensure they're available for role creation
      if (rolesSubSection !== 'permissions' && rolesSubSection !== 'roles') return;
      
      // Only show loading for permissions tab
      if (rolesSubSection === 'permissions') {
        setPermissionsLoading(true);
      }
      setPermissionsError('');
      
      try {
        const response = await permissionAPI.getAll();
        // Handle various response structures
        const data = response?.data?.data || response?.data || [];
        const permissionsArray = Array.isArray(data) ? data : [];
        
        setPermissionsData(permissionsArray);
        setPermissionsError('');
      } catch (error) {
        console.error('Permissions fetch error:', error);
        
        // Extract error message from API response
        const errorMessage = 
          error.response?.data?.message || 
          error.response?.data?.error ||
          error.message || 
          'Failed to load permissions. Please try again.';
        
        if (error.response?.status === 401) {
          setPermissionsError('Authentication required. Please try refreshing the page.');
        } else if (error.response?.status === 403) {
          setPermissionsError('Access denied. You do not have permission to view permissions.');
        } else {
          // Only show error on permissions tab
          if (rolesSubSection === 'permissions') {
            setPermissionsError(errorMessage);
          }
        }
        
        setPermissionsData([]);
      } finally {
        if (rolesSubSection === 'permissions') {
          setPermissionsLoading(false);
        }
      }
    };

    fetchPermissions();
  }, [rolesSubSection]);

  // When API permissions arrive, map them to display format
  useEffect(() => {
    if (permissionsData && permissionsData.length > 0) {
      const mapped = permissionsData.map((perm, idx) => ({
        id: perm?._id || perm?.id || `api-perm-${idx}`,
        name: permissionLabel(perm),
        description:
          perm?.description ||
          perm?.details ||
          perm?.note ||
          perm?.displayName ||
          '',
        originalData: perm, // Keep original data for API calls
      }));
      setPermissionsTable(mapped);
      setAvailablePermissions(mapped); // Store for role form
      setPermissionPage(1);
    } else {
      // Clear permissions table if no data
      setPermissionsTable([]);
      setAvailablePermissions([]);
    }
  }, [permissionsData]);

  // Fetch permissions when modal opens to ensure they're available
  useEffect(() => {
    const fetchPermissionsForModal = async () => {
      if (showRoleModal && availablePermissions.length === 0) {
        try {
          const response = await permissionAPI.getAll();
          const data = response?.data?.data || response?.data || [];
          const permissionsArray = Array.isArray(data) ? data : [];
          
          if (permissionsArray.length > 0) {
            const mapped = permissionsArray.map((perm, idx) => ({
              id: perm?._id || perm?.id || `api-perm-${idx}`,
              name: permissionLabel(perm),
              originalData: perm,
            }));
            setAvailablePermissions(mapped);
          }
        } catch (error) {
          console.error('Error fetching permissions for modal:', error);
        }
      }
    };

    fetchPermissionsForModal();
  }, [showRoleModal]);

  // Role handlers with API integration
  const handleAddRole = () => {
    setEditingRole(null);
    setRoleForm({ name: '', description: '', permissions: [], isEnabled: true });
    setRoleFormError('');
    setShowRoleModal(true);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    // Extract permission IDs from role
    const rolePermissions = role.permissions || role.permissionIds || [];
    const permissionIds = rolePermissions.map(p => 
      typeof p === 'string' ? p : (p._id || p.id || p)
    );
    
    const isEnabled = role.isEnabled !== undefined ? role.isEnabled : role.status === 'enabled' || role.status === 'active';
    
    setRoleForm({ 
      name: role.name || role.roleName || '', 
      description: role.description || '',
      permissions: permissionIds,
      isEnabled: isEnabled
    });
    setRoleFormError('');
    setShowRoleModal(true);
  };

  const handleEnableRole = async (id) => {
    // Store the role being enabled for potential revert
    const roleToEnable = rolesData.find(role => {
      const roleId = role._id || role.id;
      return roleId === id;
    });

    // Optimistic update
    setRolesData(prevRoles => 
      prevRoles.map(role => {
        const roleId = role._id || role.id;
        if (roleId === id) {
          return { ...role, isEnabled: true, status: 'enabled' };
        }
        return role;
      })
    );

    try {
      const enableResponse = await roleAPI.enable(id);
      console.log('Enable API response:', enableResponse);
      
      // Refresh roles list to get latest data
      const response = await roleAPI.getAll();
      const data = response?.data?.data || response?.data || [];
      const rolesArray = Array.isArray(data) ? data : [];
      
      console.log('Roles after enable:', rolesArray);
      
      // Normalize roles - ensure the role we enabled is marked as enabled
      const normalizedRoles = rolesArray.map(role => {
        const roleId = role._id || role.id;
        
        // Check multiple possible fields for enabled status (same as initial fetch)
        const statusValue = role.status?.toLowerCase() || '';
        const isActive = role.isActive !== undefined ? role.isActive : null;
        const active = role.active !== undefined ? role.active : null;
        const enabled = role.enabled !== undefined ? role.enabled : null;
        
        // Determine if role is enabled from multiple sources
        let isEnabledValue = false;
        
        if (role.isEnabled !== undefined) {
          isEnabledValue = role.isEnabled;
        } else if (isActive !== null) {
          isEnabledValue = isActive;
        } else if (active !== null) {
          isEnabledValue = active;
        } else if (enabled !== null) {
          isEnabledValue = enabled;
        } else if (statusValue) {
          isEnabledValue = (statusValue === 'enabled' || statusValue === 'active' || statusValue === 'enable');
        }
        
        // If this is the role we just enabled, force it to be enabled
        if (roleId === id) {
          isEnabledValue = true;
          console.log(`Forcing enabled state for role ${id}`);
        }
        
        const normalized = {
          ...role,
          isEnabled: isEnabledValue,
          status: role.status || (isEnabledValue ? 'enabled' : 'disabled')
        };
        
        // Log the specific role we enabled
        if (roleId === id) {
          console.log('Normalized enabled role:', {
            original: role,
            normalized: normalized,
            statusValue,
            isActive,
            active,
            enabled,
            finalIsEnabled: isEnabledValue
          });
        }
        
        return normalized;
      });
      
      console.log('Final normalized roles:', normalizedRoles);
      setRolesData(normalizedRoles);
      
      // Update editingRole if modal is open and this is the role being edited
      if (showRoleModal && editingRole && (editingRole._id === id || editingRole.id === id)) {
        const updatedRole = normalizedRoles.find(r => (r._id === id || r.id === id));
        if (updatedRole) {
          setEditingRole({ ...updatedRole });
          setRoleForm(prev => ({ ...prev, isEnabled: true }));
        }
      }
    } catch (error) {
      console.error('Enable role error:', error);
      // Revert optimistic update on error
      if (roleToEnable) {
        setRolesData(prevRoles => 
          prevRoles.map(role => {
            const roleId = role._id || role.id;
            if (roleId === id) {
              return roleToEnable;
            }
            return role;
          })
        );
      } else {
        // If we don't have the role, refresh from API
        try {
          const response = await roleAPI.getAll();
          const data = response?.data?.data || response?.data || [];
          const rolesArray = Array.isArray(data) ? data : [];
          setRolesData(rolesArray);
        } catch (refreshError) {
          console.error('Failed to refresh roles after error:', refreshError);
        }
      }
      alert(error.response?.data?.message || error.message || 'Failed to enable role');
    }
  };

  const handleDisableRole = async (id, skipConfirm = false) => {
    if (!skipConfirm && !window.confirm('Are you sure you want to disable this role?')) {
      return;
    }

    // Store the role being disabled for potential revert
    const roleToDisable = rolesData.find(role => {
      const roleId = role._id || role.id;
      return roleId === id;
    });

    // Optimistic update
    setRolesData(prevRoles => 
      prevRoles.map(role => {
        const roleId = role._id || role.id;
        if (roleId === id) {
          return { ...role, isEnabled: false, status: 'disabled' };
        }
        return role;
      })
    );

    try {
      const disableResponse = await roleAPI.disable(id);
      console.log('Disable API response:', disableResponse);
      
      // Refresh roles list to get latest data
      const response = await roleAPI.getAll();
      const data = response?.data?.data || response?.data || [];
      const rolesArray = Array.isArray(data) ? data : [];
      
      console.log('Roles after disable:', rolesArray);
      
      // Normalize roles - ensure the role we disabled is marked as disabled
      const normalizedRoles = rolesArray.map(role => {
        const roleId = role._id || role.id;
        
        // Check multiple possible fields for enabled status (same as initial fetch)
        const statusValue = role.status?.toLowerCase() || '';
        const isActive = role.isActive !== undefined ? role.isActive : null;
        const active = role.active !== undefined ? role.active : null;
        const enabled = role.enabled !== undefined ? role.enabled : null;
        
        // Determine if role is enabled from multiple sources
        let isEnabledValue = false;
        
        if (role.isEnabled !== undefined) {
          isEnabledValue = role.isEnabled;
        } else if (isActive !== null) {
          isEnabledValue = isActive;
        } else if (active !== null) {
          isEnabledValue = active;
        } else if (enabled !== null) {
          isEnabledValue = enabled;
        } else if (statusValue) {
          isEnabledValue = (statusValue === 'enabled' || statusValue === 'active' || statusValue === 'enable');
        }
        
        // If this is the role we just disabled, force it to be disabled
        if (roleId === id) {
          isEnabledValue = false;
          console.log(`Forcing disabled state for role ${id}`);
        }
        
        const normalized = {
          ...role,
          isEnabled: isEnabledValue,
          status: role.status || (isEnabledValue ? 'enabled' : 'disabled')
        };
        
        // Log the specific role we disabled
        if (roleId === id) {
          console.log('Normalized disabled role:', {
            original: role,
            normalized: normalized,
            statusValue,
            isActive,
            active,
            enabled,
            finalIsEnabled: isEnabledValue
          });
        }
        
        return normalized;
      });
      
      console.log('Normalized roles after disable:', normalizedRoles);
      setRolesData(normalizedRoles);
      
      // Update editingRole if modal is open and this is the role being edited
      if (showRoleModal && editingRole && (editingRole._id === id || editingRole.id === id)) {
        const updatedRole = normalizedRoles.find(r => (r._id === id || r.id === id));
        if (updatedRole) {
          setEditingRole({ ...updatedRole });
        }
        setRoleForm(prev => ({ ...prev, isEnabled: false }));
      }
    } catch (error) {
      console.error('Disable role error:', error);
      // Revert optimistic update on error
      if (roleToDisable) {
        setRolesData(prevRoles => 
          prevRoles.map(role => {
            const roleId = role._id || role.id;
            if (roleId === id) {
              return roleToDisable;
            }
            return role;
          })
        );
      } else {
        // If we don't have the role, refresh from API
        try {
          const response = await roleAPI.getAll();
          const data = response?.data?.data || response?.data || [];
          const rolesArray = Array.isArray(data) ? data : [];
          setRolesData(rolesArray);
        } catch (refreshError) {
          console.error('Failed to refresh roles after error:', refreshError);
        }
      }
      const errorMessage = error.response?.data?.message || error.message || 'Failed to disable role';
      setRoleFormError(errorMessage);
      setTimeout(() => setRoleFormError(''), 5000);
    }
  };


  const handleTogglePermission = (permissionId) => {
    setRoleForm(prev => {
      const currentPermissions = prev.permissions || [];
      const isSelected = currentPermissions.includes(permissionId);
      
      if (isSelected) {
        return {
          ...prev,
          permissions: currentPermissions.filter(id => id !== permissionId)
        };
      } else {
        return {
          ...prev,
          permissions: [...currentPermissions, permissionId]
        };
      }
    });
  };

  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setRoleFormError('');
    
    if (!roleForm.name.trim()) {
      setRoleFormError('Role name is required');
      return;
    }

    if (!roleForm.permissions || roleForm.permissions.length === 0) {
      setRoleFormError('At least one permission is required');
      return;
    }

    try {
      // Prepare permissions array - API might expect IDs or objects
      const permissionsPayload = roleForm.permissions.map(permId => {
        // Find the permission object to get the full data
        const perm = availablePermissions.find(p => p.id === permId);
        if (perm && perm.originalData) {
          // Return the original permission object or just the ID
          return perm.originalData._id || perm.originalData.id || permId;
        }
        return permId;
      });

      if (editingRole) {
        // Update role
        const roleId = editingRole._id || editingRole.id;
        await roleAPI.update(roleId, {
          name: roleForm.name.trim(),
          description: roleForm.description.trim(),
          permissions: permissionsPayload,
        });
      } else {
        // Create role
        await roleAPI.create({
          name: roleForm.name.trim(),
          description: roleForm.description.trim(),
          permissions: permissionsPayload,
        });
      }
      
      // Refresh roles list
      const response = await roleAPI.getAll();
      const data = response?.data?.data || response?.data || [];
      setRolesData(Array.isArray(data) ? data : []);
      
      setShowRoleModal(false);
      setRoleForm({ name: '', description: '', permissions: [], isEnabled: true });
      setEditingRole(null);
    } catch (error) {
      console.error('Role submit error:', error);
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        error.message || 
        'Failed to save role. Please try again.';
      setRoleFormError(errorMessage);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Roles & Permissions</h3>
          
          {/* Toggle Buttons */}
          <div className="flex space-x-3 mb-4">
            <button
              onClick={() => setRolesSubSection('roles')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                rolesSubSection === 'roles'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👤 Roles
            </button>
            <button
              onClick={() => setRolesSubSection('permissions')}
              className={`px-6 py-2 rounded-lg font-semibold transition duration-200 ${
                rolesSubSection === 'permissions'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔐 Permissions
            </button>
          </div>

          <p className="text-sm text-gray-600">
            {rolesSubSection === 'roles' 
              ? 'Overview of all user roles and their capabilities in the system'
              : 'Detailed view of permissions across all roles'}
          </p>
        </div>

        {/* Roles Content */}
        {rolesSubSection === 'roles' && (
        <>
          {rolesError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
              {rolesError}
            </div>
          )}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h4 className="font-semibold text-gray-800">Roles List</h4>
              <div className="flex items-center space-x-3">
                {rolesLoading && (
                  <span className="text-sm text-gray-500 animate-pulse">Loading...</span>
                )}
                <button
                  onClick={handleAddRole}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition duration-200"
                >
                  + Add Role
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rolesData.map((role) => {
                    const roleId = role._id || role.id;
                    const roleName = role.name || role.roleName || '';
                    const roleDescription = role.description || '';
                    // Use normalized isEnabled value (should always be set by normalization)
                    const isEnabled = role.isEnabled === true;
                    
                    return (
                      <tr key={roleId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{roleName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{roleDescription}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-3">
                            <button
                              onClick={() => handleEditRole(role)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <EditIcon className="w-5 h-5" />
                            </button>
                            {/* Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={(e) => {
                                  const newValue = e.target.checked;
                                  if (newValue) {
                                    handleEnableRole(roleId);
                                  } else {
                                    handleDisableRole(roleId, true);
                                  }
                                }}
                                className="sr-only peer"
                                aria-label={isEnabled ? 'Disable role' : 'Enable role'}
                              />
                              <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                                isEnabled ? 'bg-orange-500' : 'bg-gray-200'
                              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300`}>
                                <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ${
                                  isEnabled ? 'translate-x-full' : 'translate-x-0'
                                }`}></div>
                              </div>
                            </label>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {rolesData.length === 0 && !rolesLoading && (
                    <tr>
                      <td colSpan="4" className="px-6 py-6 text-center text-sm text-gray-500">No roles available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
        )}

        {/* Permissions Content */}
        {rolesSubSection === 'permissions' && (
        <>
        {/* API-backed permission list */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              {/* <h4 className="text-lg font-semibold text-gray-800">Permissions</h4>
              <p className="text-sm text-gray-600">
                Permissions loaded from API
              </p> */}
            </div>
            {permissionsLoading && (
              <span className="text-sm text-gray-500 animate-pulse">Loading...</span>
            )}
          </div>
          {permissionsError && (
            <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
              {permissionsError}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b">
            <h4 className="font-semibold text-gray-800">Permissions List</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissionsTable
                  .slice((permissionPage - 1) * PERMISSION_PAGE_SIZE, permissionPage * PERMISSION_PAGE_SIZE)
                  .map((perm) => (
                  <tr key={perm.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{perm.name}</td>
                  </tr>
                ))}
                {permissionsTable.length === 0 && (
                  <tr>
                    <td colSpan="1" className="px-6 py-6 text-center text-sm text-gray-500">No permissions available.</td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Pagination */}
            {permissionsTable.length > PERMISSION_PAGE_SIZE && (
              <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-700">
                <span>
                  Showing {(permissionPage - 1) * PERMISSION_PAGE_SIZE + 1}-
                  {Math.min(permissionPage * PERMISSION_PAGE_SIZE, permissionsTable.length)} of {permissionsTable.length}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => setPermissionPage((p) => Math.max(1, p - 1))}
                    disabled={permissionPage === 1}
                    className={`px-3 py-1 rounded border ${
                      permissionPage === 1
                        ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Prev
                  </button>
                  <button
                    onClick={() =>
                      setPermissionPage((p) =>
                        p * PERMISSION_PAGE_SIZE < permissionsTable.length ? p + 1 : p
                      )
                    }
                    disabled={permissionPage * PERMISSION_PAGE_SIZE >= permissionsTable.length}
                    className={`px-3 py-1 rounded border ${
                      permissionPage * PERMISSION_PAGE_SIZE >= permissionsTable.length
                        ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-bold mb-6 flex-shrink-0">
              {editingRole ? 'Edit Role' : 'Add Role'}
            </h3>
            <form onSubmit={handleRoleSubmit} className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={roleForm.name}
                    onChange={(e) => {
                      setRoleForm({ ...roleForm, name: e.target.value });
                      if (roleFormError) setRoleFormError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={roleForm.description}
                    onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions <span className="text-red-500">*</span>
                  </label>
                  {availablePermissions.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2">
                      Loading permissions...
                    </div>
                  ) : (
                    <div className="border border-gray-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {availablePermissions.map((permission) => {
                          const isSelected = roleForm.permissions?.includes(permission.id);
                          return (
                            <label
                              key={permission.id}
                              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleTogglePermission(permission.id)}
                                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                              />
                              <span className="text-sm text-gray-700">{permission.name}</span>
                            </label>
                          );
                        })}
                      </div>
                      {roleForm.permissions && roleForm.permissions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            {roleForm.permissions.length} permission{roleForm.permissions.length !== 1 ? 's' : ''} selected
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {roleFormError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                    {roleFormError}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 mt-6 flex-shrink-0">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200"
                >
                  {editingRole ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRoleModal(false);
                    setRoleFormError('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RolesPermissions;

