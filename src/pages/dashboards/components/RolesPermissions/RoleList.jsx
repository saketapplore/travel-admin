import React from 'react';
import { EditIcon, DeleteIcon } from '@/components/icons';

const RoleList = ({ roles, loading, onEdit, onEnable, onDisable, onDelete, canEdit, canDelete }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h4 className="font-semibold text-gray-800">Roles List</h4>
        {loading && <span className="text-sm text-gray-500 animate-pulse">Loading...</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role._id || role.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {role.name || role.roleName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{role.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${role.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {role.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    {canEdit && (
                      <button
                        onClick={() => onEdit(role)}
                        className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(role._id || role.id)}
                        className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <DeleteIcon className="w-5 h-5" />
                      </button>
                    )}
                    {canEdit && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={role.isEnabled}
                          onChange={(e) =>
                            e.target.checked
                              ? onEnable(role._id || role.id)
                              : onDisable(role._id || role.id)
                          }
                          className="sr-only peer"
                        />
                        <div
                          className={`relative w-11 h-6 rounded-full transition-colors ${role.isEnabled ? 'bg-orange-500' : 'bg-gray-200'} peer-focus:ring-4 peer-focus:ring-orange-300`}
                        >
                          <div
                            className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${role.isEnabled ? 'translate-x-full' : 'translate-x-0'}`}
                          ></div>
                        </div>
                      </label>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {roles.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="px-6 py-6 text-center text-sm text-gray-500">
                  No roles available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleList;
