import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';
import { roleService } from '../../../services/roleService';
import { useAuth } from '../../../context/AuthContext';

const AdminUsers = () => {
  const { user, refreshUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [activeRoles, setActiveRoles] = useState([]);
  const [activeRolesLoading, setActiveRolesLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [createFormError, setCreateFormError] = useState('');
  const [creating, setCreating] = useState(false);

  // Edit User states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    role: '',
    password: '',
    confirmPassword: ''
  });
  const [editFormError, setEditFormError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Fetch all roles for filter dropdown
  const fetchRoles = async () => {
    setRolesLoading(true);
    try {
      const response = await roleService.getAll();
      const data = response?.data?.data || response?.data || [];
      const rolesArray = Array.isArray(data) ? data : [];
      setRoles(rolesArray);
    } catch (error) {
      console.error('Roles fetch error:', error);
    } finally {
      setRolesLoading(false);
    }
  };

  // Fetch active roles for create admin modal
  const fetchActiveRoles = async () => {
    setActiveRolesLoading(true);
    try {
      const response = await roleService.getActive();
      const data = response?.data?.data || response?.data || [];
      const rolesArray = Array.isArray(data) ? data : [];
      setActiveRoles(rolesArray);
    } catch (error) {
      console.error('Active roles fetch error:', error);
      // Fallback to all roles if active roles API fails
      setActiveRoles(roles);
    } finally {
      setActiveRolesLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await userService.getAll({ limit: 1000 });
      // Handle various response structures
      const data = response?.data?.data || response?.data || [];
      const usersArray = Array.isArray(data) ? data : [];

      // Normalize users to ensure consistent structure
      // Since API now returns all users (active and inactive), we need to properly detect status
      const normalizedUsers = usersArray.map(user => {
        // Check multiple possible fields for active status
        const statusValue = user.status?.toLowerCase() || '';
        const isActive = user.isActive !== undefined
          ? user.isActive
          : (statusValue === 'active' || statusValue === 'enabled' || user.active === true);

        return {
          ...user,
          isActive: isActive,
          status: user.status || (isActive ? 'active' : 'inactive')
        };
      });

      setUsers(normalizedUsers);

      setError('');
    } catch (error) {
      console.error('Users fetch error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to load users. Please try again.';
      setError(errorMessage);
      // Don't clear users on error, keep existing state
    } finally {
      setLoading(false);
    }
  };

  // Handle enable user
  const handleEnableUser = async (id) => {
    // Store the user being enabled for potential revert
    const userToEnable = users.find(user => {
      const userId = user._id || user.id;
      return userId === id;
    });

    // Optimistic update
    setUsers(prevUsers =>
      prevUsers.map(user => {
        const userId = user._id || user.id;
        if (userId === id) {
          return { ...user, isActive: true, status: 'active' };
        }
        return user;
      })
    );

    try {
      const enableResponse = await userService.activate(id);
      console.log('Enable API response:', enableResponse);

      // Refresh users list to get latest data
      await fetchUsers();
    } catch (error) {
      console.error('Enable user error:', error);

      // Revert optimistic update on error
      setUsers(prevUsers =>
        prevUsers.map(user => {
          const userId = user._id || user.id;
          if (userId === id && userToEnable) {
            return { ...userToEnable };
          }
          return user;
        })
      );

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to enable user. Please try again.';
      setError(errorMessage);
    }
  };

  // Handle disable user
  const handleDisableUser = async (id) => {
    // Store the user being disabled for potential revert
    const userToDisable = users.find(user => {
      const userId = user._id || user.id;
      return userId === id;
    });

    // Optimistic update
    setUsers(prevUsers =>
      prevUsers.map(user => {
        const userId = user._id || user.id;
        if (userId === id) {
          return { ...user, isActive: false, status: 'inactive' };
        }
        return user;
      })
    );

    try {
      const disableResponse = await userService.deactivate(id);
      console.log('Disable API response:', disableResponse);

      // Refresh users list to get latest data
      await fetchUsers();
    } catch (error) {
      console.error('Disable user error:', error);

      // Revert optimistic update on error
      setUsers(prevUsers =>
        prevUsers.map(user => {
          const userId = user._id || user.id;
          if (userId === id && userToDisable) {
            return { ...userToDisable };
          }
          return user;
        })
      );

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to disable user. Please try again.';
      setError(errorMessage);
    }
  };

  // Handle create admin user
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateFormError('');
    setCreating(true);

    // Validate form
    if (!createForm.email || !createForm.password || !createForm.role) {
      setCreateFormError('Please fill in all required fields.');
      setCreating(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createForm.email)) {
      setCreateFormError('Please enter a valid email address.');
      setCreating(false);
      return;
    }

    try {
      const response = await userService.create({
        email: createForm.email.trim(),
        password: createForm.password,
        role: createForm.role
      });

      console.log('Create admin response:', response);

      // Close modal and reset form
      setShowCreateModal(false);
      setCreateForm({ email: '', password: '', role: '' });
      setCreateFormError('');

      // Refresh users list and reset to first page
      setCurrentPage(1);
      await fetchUsers();
    } catch (error) {
      console.error('Create admin error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create admin user. Please try again.';
      setCreateFormError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  // Handle update user (Super Admin only)
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setEditFormError('');
    setUpdating(true);

    // Verify user is super admin before making request
    if (user?.roleKey !== 'super-admin') {
      setEditFormError('Only Super Admin can manage other admin users.');
      setUpdating(false);
      return;
    }

    if (!editForm.role) {
      setEditFormError('Please select a role.');
      setUpdating(false);
      return;
    }

    // Validate password if provided
    if (editForm.password && editForm.password.trim() !== '') {
      if (editForm.password.length < 6) {
        setEditFormError('Password must be at least 6 characters long.');
        setUpdating(false);
        return;
      }
      if (!editForm.confirmPassword || editForm.confirmPassword.trim() === '') {
        setEditFormError('Please confirm your password by entering it again in the Confirm Password field.');
        setUpdating(false);
        return;
      }
      if (editForm.password !== editForm.confirmPassword) {
        setEditFormError('Passwords do not match. Please ensure both password fields are identical.');
        setUpdating(false);
        return;
      }
    }

    // Check token role before making request
    const adminUser = localStorage.getItem('adminUser');
    let tokenRole = null;
    if (adminUser) {
      try {
        const userData = JSON.parse(adminUser);
        if (userData.token) {
          try {
            const parts = userData.token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
              tokenRole = payload.role || payload.roleKey || payload.userRole;
            }
          } catch (e) {
            console.error('Error decoding token:', e);
          }
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Check if token role indicates super admin
    const isTokenSuperAdmin = tokenRole && (
      tokenRole.toLowerCase().includes('super') || 
      tokenRole.toLowerCase().includes('admin') ||
      tokenRole === 'super-admin' ||
      tokenRole === 'Super Admin'
    );

    if (!isTokenSuperAdmin && tokenRole) {
      setEditFormError(
        `Permission denied. Your authentication token shows your role as "${tokenRole}", ` +
        `but this action requires Super Admin privileges. Please log out and log back in to refresh your token.`
      );
      setUpdating(false);
      return;
    }

    try {
      // Refresh user data from backend to ensure token and role are current
      if (refreshUser) {
        const refreshResult = await refreshUser();
        if (!refreshResult.success) {
          console.warn('Failed to refresh user data, proceeding with existing data');
        } else {
          console.log('User data refreshed successfully');
        }
      }

      const updateData = {
        role: editForm.role
      };

      // Only add password if it's provided (not empty)
      if (editForm.password && editForm.password.trim() !== '') {
        updateData.password = editForm.password;
      }

      // Get current user again after refresh
      const currentUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

      // Log request details for debugging
      console.log('Updating user:', {
        userId: editingUser._id || editingUser.id,
        updateData,
        currentUser: {
          email: currentUser?.email || user?.email,
          role: currentUser?.role || user?.role,
          roleKey: currentUser?.roleKey || user?.roleKey,
          hasToken: !!currentUser?.token
        }
      });

      const response = await userService.manage(editingUser._id || editingUser.id, updateData);
      console.log('Update user response:', response);

      // Close modal and reset form
      setShowEditModal(false);
      setEditForm({ role: '', password: '', confirmPassword: '' });
      setEditFormError('');
      setEditingUser(null);

      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Update user error:', error);
      
      // Decode token to check actual role
      const adminUser = localStorage.getItem('adminUser');
      let tokenRole = 'Unknown';
      if (adminUser) {
        try {
          const userData = JSON.parse(adminUser);
          if (userData.token) {
            // Decode JWT token to see actual role
            try {
              const parts = userData.token.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
                tokenRole = payload.role || payload.roleKey || payload.userRole || 'Not found in token';
              }
            } catch (e) {
              console.error('Error decoding token:', e);
            }
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
      
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        localStorageRole: user?.role || user?.roleKey,
        tokenRole: tokenRole
      });
      
      // Extract error message with better handling
      let errorMessage = 'Failed to update user. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // If it's a permission error, provide more helpful message
      if (errorMessage.toLowerCase().includes('permission') || 
          errorMessage.toLowerCase().includes('super admin') ||
          errorMessage.toLowerCase().includes('access denied')) {
        errorMessage += `\n\nDebug Info: Your token shows role as "${tokenRole}" but localStorage shows "${user?.role || user?.roleKey}". `;
        errorMessage += 'The backend validates permissions based on the role in your authentication token. ';
        errorMessage += 'If these don\'t match, please log out and log back in to get a fresh token with the correct role.';
      }

      setEditFormError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      render: (value) => value || 'N/A',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'email',
      header: 'Email',
      accessor: 'email',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'role',
      header: 'Role',
      accessor: (row) => row,
      render: (_, row) => {
        // Handle role as object or string
        const role = row.role || row.roleName;
        if (!role) return 'N/A';

        // If role is an object, extract the name property
        if (typeof role === 'object' && role !== null) {
          return role.name || role.roleName || 'N/A';
        }

        // If role is a string, return it directly
        return role || 'N/A';
      },
      cellClassName: 'text-sm text-gray-700'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => row,
      render: (_, row) => {
        const userId = row._id || row.id;
        const isActive = row.isActive !== undefined
          ? row.isActive
          : (row.status === 'active' || row.status === 'Active' || row.status === 'enabled');

        return (
          <div className="flex items-center space-x-3">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {isActive ? 'Active' : 'Disabled'}
            </span>
            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  if (newValue) {
                    handleEnableUser(userId);
                  } else {
                    handleDisableUser(userId);
                  }
                }}
                className="sr-only peer"
                aria-label={isActive ? 'Disable user' : 'Enable user'}
              />
              <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isActive ? 'bg-orange-500' : 'bg-gray-200'
                } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300`}>
                <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ${isActive ? 'translate-x-full' : 'translate-x-0'
                  }`}></div>
              </div>
            </label>
          </div>
        );
      },
      cellClassName: 'text-sm'
    }
  ];

  // Add Action column for Edit option if user is super admin
  if (user?.roleKey === 'super-admin') {
    columns.push({
      key: 'action',
      header: 'Action',
      accessor: (row) => row,
      render: (_, row) => (
        <button
          onClick={() => {
            const roleId = typeof row.role === 'object' && row.role !== null
              ? row.role._id || row.role.id
              : row.role;

            setEditingUser(row);
            setEditForm({
              role: roleId || '', // Pre-select current role
              password: '', // Don't pre-fill password
              confirmPassword: '' // Don't pre-fill confirm password
            });
            setEditFormError('');
            setShowEditModal(true);
            fetchActiveRoles();
          }}
          className="text-orange-600 hover:text-orange-900 font-medium"
        >
          Edit
        </button>
      ),
      cellClassName: 'text-sm font-medium'
    });
  }

  // Filter users based on search, role, and status
  const filteredUsers = users.filter(user => {
    // Search filter (name or email)
    const matchesSearch = searchQuery === '' ||
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()));

    // Role filter
    const matchesRole = roleFilter === '' || (() => {
      if (roleFilter === '') return true;

      const userRole = user.role || user.roleName;
      if (!userRole) return false;

      // If role is an object, compare by ID
      if (typeof userRole === 'object' && userRole !== null) {
        const roleId = userRole._id || userRole.id;
        return roleId === roleFilter;
      }

      // If role is a string (role name), compare with role names from roles list
      const selectedRole = roles.find(r => (r._id || r.id) === roleFilter);
      if (selectedRole) {
        const selectedRoleName = selectedRole.name || selectedRole.roleName || '';
        return userRole.toString().toLowerCase() === selectedRoleName.toLowerCase();
      }

      return false;
    })();

    // Status filter
    const matchesStatus = statusFilter === '' || (() => {
      const isActive = user.isActive !== undefined
        ? user.isActive
        : (user.status === 'active' || user.status === 'Active' || user.status === 'enabled');

      if (statusFilter === 'active') {
        return isActive === true;
      } else if (statusFilter === 'disabled') {
        return isActive === false;
      }
      return true;
    })();

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate pagination based on filtered users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Admin Users</h3>
              <p className="text-sm text-gray-600">Manage admin users and their activation status</p>
            </div>
            <button
              onClick={() => {
                setShowCreateModal(true);
                setCreateForm({ email: '', password: '', role: '' });
                setCreateFormError('');
                fetchActiveRoles(); // Fetch active roles when modal opens
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 flex items-center space-x-2"
            >
              <span>+</span>
              <span>Create Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

        {/* Filters Section */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Filters</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name or Email
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Role
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                {roles.map((role) => {
                  const roleId = role._id || role.id;
                  const roleName = role.name || role.roleName || 'Unnamed Role';
                  return (
                    <option key={roleId} value={roleId}>
                      {roleName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || roleFilter || statusFilter) && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('');
                  setStatusFilter('');
                }}
                className="text-sm text-orange-600 hover:text-orange-800 font-medium"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-6 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-6 text-center text-sm text-gray-500">
                      {users.length === 0
                        ? 'No users available.'
                        : 'No users match the current filters.'}
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => {
                    const userId = user._id || user.id;
                    const isActive = user.isActive !== undefined
                      ? user.isActive
                      : (user.status === 'active' || user.status === 'Active' || user.status === 'enabled');

                    return (
                      <tr key={userId} className="hover:bg-gray-50">
                        {columns.map((col) => {
                          const value = typeof col.accessor === 'function'
                            ? col.accessor(user)
                            : user[col.accessor];

                          return (
                            <td
                              key={col.key}
                              className={`px-6 py-4 whitespace-nowrap ${col.cellClassName || ''}`}
                            >
                              {col.render ? col.render(value, user) : value}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
              {users.length !== filteredUsers.length && (
                <span className="text-gray-500 ml-2">(filtered from {users.length} total)</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                  }`}
              >
                Previous
              </button>
              {totalPages > 0 && (
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      totalPages <= 7 ||
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg font-semibold transition duration-200 ${currentPage === page
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'
                            }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
              <button
                onClick={() => {
                  if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 my-8">
            <h3 className="text-2xl font-bold mb-6">Create Admin User</h3>
            <form onSubmit={handleCreateAdmin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => {
                      setCreateForm({ ...createForm, email: e.target.value });
                      if (createFormError) setCreateFormError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => {
                      setCreateForm({ ...createForm, password: e.target.value });
                      if (createFormError) setCreateFormError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  {activeRolesLoading ? (
                    <div className="text-sm text-gray-500 py-2">Loading active roles...</div>
                  ) : activeRoles.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2">No active roles available</div>
                  ) : (
                    <select
                      value={createForm.role}
                      onChange={(e) => {
                        setCreateForm({ ...createForm, role: e.target.value });
                        if (createFormError) setCreateFormError('');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a role</option>
                      {activeRoles.map((role) => {
                        const roleId = role._id || role.id;
                        const roleName = role.name || role.roleName || 'Unnamed Role';
                        return (
                          <option key={roleId} value={roleId}>
                            {roleName}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
                {createFormError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                    {createFormError}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create Admin User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateForm({ email: '', password: '', role: '' });
                    setCreateFormError('');
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Functionality Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 my-8">
            <h3 className="text-2xl font-bold mb-6">Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingUser?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  {activeRolesLoading ? (
                    <div className="text-sm text-gray-500 py-2">Loading active roles...</div>
                  ) : activeRoles.length === 0 ? (
                    <div className="text-sm text-gray-500 py-2">No active roles available</div>
                  ) : (
                    <select
                      value={editForm.role}
                      onChange={(e) => {
                        setEditForm({ ...editForm, role: e.target.value });
                        if (editFormError) setEditFormError('');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a role</option>
                      {activeRoles.map((role) => {
                        const roleId = role._id || role.id;
                        const roleName = role.name || role.roleName || 'Unnamed Role';
                        return (
                          <option key={roleId} value={roleId}>
                            {roleName}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => {
                      setEditForm({ ...editForm, password: e.target.value });
                      if (editFormError) setEditFormError('');
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Leave blank to keep current password"
                  />
                  <p className="text-xs text-gray-500 mt-1">Only fill this if you want to change the password</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={editForm.confirmPassword}
                    onChange={(e) => {
                      setEditForm({ ...editForm, confirmPassword: e.target.value });
                      if (editFormError) setEditFormError('');
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      editForm.confirmPassword && editForm.password && editForm.password.trim() !== '' && editForm.password !== editForm.confirmPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="Re-enter the password to confirm"
                  />
                  {editForm.password && editForm.password.trim() !== '' && editForm.confirmPassword && editForm.password !== editForm.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                  {editForm.password && editForm.password.trim() !== '' && (
                    <p className="text-xs text-gray-500 mt-1">Please confirm your new password</p>
                  )}
                </div>
                {editFormError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
                    {editFormError}
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditForm({ role: '', password: '', confirmPassword: '' });
                    setEditFormError('');
                    setEditingUser(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition duration-200"
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

export default AdminUsers;

