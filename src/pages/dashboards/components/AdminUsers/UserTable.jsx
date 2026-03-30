import React from 'react';

const UserTable = ({
  users,
  filteredCount,
  totalCount,
  loading,
  columns,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
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
                <td
                  colSpan={columns.length}
                  className="px-6 py-6 text-center text-sm text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-6 text-center text-sm text-gray-500"
                >
                  {totalCount === 0 ? 'No users available.' : 'No users match the current filters.'}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id || user.id} className="hover:bg-gray-50">
                  {columns.map((col) => {
                    const value =
                      typeof col.accessor === 'function' ? col.accessor(user) : user[col.accessor];
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {users.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCount)} of{' '}
            {filteredCount} users
            {totalCount !== filteredCount && (
              <span className="text-gray-500 ml-2">(filtered from {totalCount} total)</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'}`}
            >
              Previous
            </button>
            <button
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
