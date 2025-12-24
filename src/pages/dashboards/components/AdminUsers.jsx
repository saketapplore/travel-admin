import React, { useState, useEffect } from 'react';
import { userAPI } from '../../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await userAPI.getAll();
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


  const columns = [
    {
      key: 'name',
      header: 'Name',
      accessor: 'name',
      cellClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'email',
      header: 'Email',
      accessor: 'email',
      cellClassName: 'text-sm text-gray-500'
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => row,
      render: (_, row) => {
        const isActive = row.isActive !== undefined 
          ? row.isActive 
          : (row.status === 'active' || row.status === 'Active' || row.status === 'enabled');
        
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Active' : 'Disabled'}
          </span>
        );
      },
      cellClassName: 'text-sm'
    }
  ];

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Admin Users</h3>
              <p className="text-sm text-gray-600">Manage admin users and their activation status</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}

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
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-6 text-center text-sm text-gray-500">
                      No users available.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
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
      </div>

    </>
  );
};

export default AdminUsers;

