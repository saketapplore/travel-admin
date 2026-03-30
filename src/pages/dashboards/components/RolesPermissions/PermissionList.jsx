import React from 'react';

const PermissionList = ({ permissions, loading, error, page, pageSize, onPageChange }) => {
  const startIndex = (page - 1) * pageSize;
  const currentPermissions = permissions.slice(startIndex, page * pageSize);

  const permissionLabel = (perm) =>
    perm?.name ||
    perm?.permissionName ||
    perm?.displayName ||
    perm?.title ||
    perm?.code ||
    perm?.slug ||
    perm?._id ||
    perm?.id ||
    (typeof perm === 'string' ? perm : 'N/A');

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <h4 className="font-semibold text-gray-800">Permissions List</h4>
        {loading && <span className="text-sm text-gray-500 animate-pulse">Loading...</span>}
      </div>
      {error && <div className="p-4 text-red-700 bg-red-50 text-sm">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPermissions.map((perm, idx) => (
              <tr key={perm._id || perm.id || idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {permissionLabel(perm)}
                </td>
              </tr>
            ))}
            {permissions.length === 0 && !loading && (
              <tr>
                <td className="px-6 py-6 text-center text-sm text-gray-500">
                  No permissions available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {permissions.length > pageSize && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-700">
            <span>
              Showing {startIndex + 1}-{Math.min(page * pageSize, permissions.length)} of{' '}
              {permissions.length}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-3 py-1 rounded border ${page === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
              >
                Prev
              </button>
              <button
                onClick={() => page * pageSize < permissions.length && onPageChange(page + 1)}
                disabled={page * pageSize >= permissions.length}
                className={`px-3 py-1 rounded border ${page * pageSize >= permissions.length ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionList;
